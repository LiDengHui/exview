<style lang="scss" scoped>

</style>
<template>
    <menu-group :title="option.name">
        <exv-menu-item v-for="(item,index) in option.children" :key="index" :option="item"></exv-menu-item>
    </menu-group>
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
