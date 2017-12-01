<style lang="scss" scoped>

</style>
<template>
    <div>
        MENU
        <exv-menu :option="navs">
            <div slot="menu-pre">{{"menu-pre"}}</div>
            <div slot="menu-after">{{"menu-after"}}</div>
        </exv-menu>
    </div>
</template>
<script>
import { menu } from "./data";
export default {
    components: {},
    data() {
        return {
            navs: {
                "active-name": "文章管理", //
                theme: "primary", //
                width: "",
                // mode: "horizontal",
                "open-names": [],
                items: menu
            }
        };
    }
};
</script>
