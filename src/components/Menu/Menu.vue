<template>
    <Menu :mode="option.mode" :active-name="option['active-name']" :theme="option.theme" :width="option.width" :open-names="option['open-names']" @on-select="go">
        <slot name="menu-pre"></slot>
        <template v-for="(item,index) in navs">
            <exv-sub-menu v-if="item.type.indexOf('sub') > -1" :option="item" v-bind:key="index"></exv-sub-menu>
            <exv-menu-group v-else-if="item.type.indexOf('group') > -1" :option="item" v-bind:key="index"></exv-menu-group>
            <exv-menu-item v-else-if="item.type.indexOf('item')>-1" v-bind:key="index" :option="item"></exv-menu-item>
        </template>
        <slot name="menu-after"></slot>
    </Menu>
</template>
<script>
/**
 * @ flow
*/
import _ from "lodash";
import { itemsHandle } from "@/commons/utils";

export default {
    props: {
        option: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        navs() {
            return itemsHandle(this.option.items);
        }
    },
    methods: {
        go(name) {
            const targets = _.filter(this.option.items, { name });
            if (targets[0]) {
                this.$router.push(targets[0].href);
            }
        }
    }
};
</script>
