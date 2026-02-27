import { fetch } from "@/commons/utils";

export default url => {
    url = `http://localhost:3000/${url}`;
    return {
        list(data) {
            return fetch(data, url);
        },
        delete(id) {
            return fetch(null, `${url}/${id}`, "DELETE");
        },
        add(data) {
            return fetch(data, url, "POST");
        },
        put(id, data) {
            return fetch(data, `url/${id}`, "PUT");
        }
    };
};
