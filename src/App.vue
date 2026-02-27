<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
/* @flow */
let a: number = 1;
export default {
    data() {
        return {
            text: a
        };
    }
};
</script>
<style lang="scss">

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>

