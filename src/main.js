// @flow
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import exView from "./index";

Vue.config.productionTip = false;

Vue.use(exView);

export default new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: {
        App
    }
});
