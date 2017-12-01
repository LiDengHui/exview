export default async (data = {}, url = "", type = "GET", method = "fetch") => {
    type = type.toUpperCase();

    if (type === "GET") {
        let dataStr = ""; // 数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += `${key}=${data[key]}&`;
        });

        if (dataStr !== "") {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
            url = `${url}?${dataStr}`;
        }
    }

    if (window.fetch && method.toUpperCase === "FETCH") {
        const requestConfig = {
            credentials: "include",
            method: type,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            mode: "cors",
            cache: "force-cache"
        };

        if (type === "POST") {
            Object.defineProperty(requestConfig, "body", {
                value: JSON.stringify(data)
            });
        }

        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            throw new Error(error);
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                const XmlHttpVersions = [
                    "MSXML2.XMLHTTP.6.0",
                    "MSXML2.XMLHTTP.5.0",
                    "MSXML2.XMLHTTP.4.0",
                    "MSXML2.XMLHTTP.3.0",
                    "MSXML2.XMLHTTP",
                    "Microsoft.XMLHTTP"
                ];

                for (let i = 0; i < XmlHttpVersions.length; i += 1) {
                    try {
                        requestObj = new window.ActiveXObject(
                            XmlHttpVersions[i]
                        );
                    } catch (e) {
                        throw e;
                    }
                }
            }

            let sendData = "";
            if (type === "POST") {
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader("Content-type", "application/json");
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState.toString() === "4") {
                    if (requestObj.status.toString().match(/^2\d{2}$/)) {
                        let obj =
                            requestObj.response || requestObj.responseText;
                        if (typeof obj !== "object") {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);
                    } else {
                        reject(requestObj);
                    }
                }
            };
        });
    }
};
