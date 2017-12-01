/**
 * @ flow
 */

import comps from "@/components";
import iView from "iview";
import "iview/dist/styles/iview.css";
import "./style/index.scss";

const prefix = "Exv";

export default {
    install(Vue) {
        /**
         * 注册组件
         */
        Vue.use(iView);
        Object.keys(comps).forEach(k => {
            Vue.component(`${prefix}${k}`, comps[k]);
        });
    }
};
