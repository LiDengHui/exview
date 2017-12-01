<style lang="scss" scoped>

</style>
<template>
    <div>
        <div>TOOLBAE</div>
        <exv-toolbar v-bind="option" @click="toolbarClick"></exv-toolbar>
        <div>SIGNAL: {{signal}}</div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            signal: "",
            option: {
                fields: [
                    {
                        type: "primary",
                        text: "提交",
                        confirm: "确认提交",
                        placement: "bottom",
                        signal: "submit",
                    },
                    {
                        type: "default",
                        text: "延迟提交",
                        loading: false,
                        confirm: "确认提交",
                        placement: "bottom",
                        signal: function(e, item, index) {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve("delaySubmit");
                                }, 3000);
                            });
                        }
                    },
                    {
                        type: "default",
                        text: "取消",
                        loading: false,
                        signal: "reset"
                    }
                ]
            }
        };
    },
    methods: {
        toolbarClick(signal, item) {
            console.dir(item);
            if (signal === "reset") {
                signal = "";
            }
            this.signal = signal;
        }
    },
    mounted() {}
};
</script>
