/**
 * @ flow
 */
import Vue from "vue";
import Vuex from "vuex";
import cookieStorage from "js-cookie";
import api from "@/api";
import responseStatus from "@/dictionary/responseStatus";

Vue.use(Vuex);

const state = {
    // 用户基本信息，包涵用户权限
    userInfo: {}
};

const mutations = {
    saveAdminInfo(state, userInfo: Object): void {
        state.userInfo = userInfo;
    }
};

const actions = {
    async getAdminData({ commit }) {
        let res;
        try {
            res = await api.getSession();
            if (res.code === responseStatus.SUCCESS) {
                commit("saveAdminInfo", res.output);
            } else {
                throw new Error(res);
            }
        } catch (e) {
            throw new Error(e);
        }
        return res;
    },
    async logout({ commit }) {
        let res;
        try {
            res = await api.ReleaseSession();
            if (res.code === responseStatus.SUCCESS) {
                commit("saveAdminInfo", {});
            }
        } finally {
            cookieStorage.remove("chinasoftinc_token");
        }
    }
};

export default new Vuex.Store({
    state,
    actions,
    mutations
});
