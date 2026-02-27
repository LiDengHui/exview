<style lang="scss" scoped>

</style>
<template>
    <menu-item :name="option.name">
        <icon :type="option.icon" v-if="option.icon"></icon>
        {{option.name}}
    </menu-item>
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
