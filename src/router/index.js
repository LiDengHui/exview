// @flow

import Vue from "vue";
import Router from "vue-router";

// @ page
import Major from "@/view/layout/major";
import Menu from "@/view/menu/menu";
import Form from "@/view/form/form";

import Toolbar from "@/view/toolbar/toolbar";

import Table from "@/view/table/table";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "major",
            component: Major,
            children: [
                {
                    path: "Menu",
                    name: "Menu",
                    component: Menu
                },
                {
                    path: "Form",
                    name: "Form",
                    component: Form
                },
                {
                    path: "Toolbar",
                    name: "Toolbar",
                    component: Toolbar
                },
                {
                    path: "Table",
                    name: "Table",
                    component: Table
                }
            ]
        }
    ]
});
