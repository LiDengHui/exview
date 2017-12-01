<style lang="scss" scoped>
.epv-major {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    > .menu {
        width: 200px;
        min-width: 200px;
    }
    > .content {
        flex: auto;
        overflow: auto;
    }
}
</style>
<template>
    <div class="epv-major">
        <exv-menu class="menu" :option="MenuOption" />
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>
<script>
/**
 * @ flow
*/
const MenuOption = {
    items: [
        {
            name: "菜单",
            type: "item",
            href: {
                name: "Menu"
            }
        },
        {
            name: "表单",
            type: "item",
            href: {
                name: "Form"
            }
        },
        {
            name: "按钮组",
            type: "item",
            href: {
                name: "Toolbar"
            }
        },
        {
            name: "表格",
            type: "item",
            href: {
                name: "Table"
            }
        }
    ]
};
export default {
    components: {},
    data() {
        return { MenuOption };
    },
    methods: {},
    mounted() {}
};
</script>
