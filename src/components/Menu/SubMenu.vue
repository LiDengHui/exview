<style lang="scss" scoped>

</style>
<template>
    <submenu :name="option.name">
        <template slot="title">
            <icon :type="option.icon" /> {{option.name}}
        </template>
        <template v-for="(item,index) in option.children">
            <exv-menu-group v-if="item.type.indexOf('group')>-1" :option="item" v-bind:key="index"></exv-menu-group>
            <exv-menu-item v-else :key="index" :option="item"></exv-menu-item>
        </template>
    </submenu>
</template>
<script>
export default {
    props: {
        option: {
            default() {
                return {};
            }
        }
    }
};
</script>
