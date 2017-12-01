<style lang="scss" scoped>

</style>
<template>
    <form-item v-bind="$props" class="exv-form-item">
        <component :is="widget" v-bind="widgetOption" ref="widget" v-on="widgetEvents"></component>
    </form-item>
</template>
<script>
import { formItemEvents, wightValues } from "@/commons/utils";
export default {
    name: "item",
    props: {
        label: {},
        labelWidth: {},
        labelFor: {},
        requied: {},
        rules: {},
        error: {},
        showMessage: {},
        widget: {},
        name: {},
        option: {},
        events: {}
    },
    data() {
        this.$props.prop = this.name;
        let widgetOption = {
            name: this.name,
            ...(this.option || {})
        };

        let widgetEvents = {
            exvChange(value) {
                this.$emit("exvChange", value, this.$parent.model);
            }
        };
        const itemEvents = formItemEvents[this.widget];
        if (itemEvents) {
            Object.keys(itemEvents).forEach(key => {
                widgetEvents[key] = (...args) => {
                    itemEvents[key].call(this, ...args, this.$parent.model);
                };
            });
        }

        if (this.events) {
            Object.keys(this.events).forEach(key => {
                widgetEvents[key] = (...args) => {
                    this.events[key].call(this, ...args, this.$parent.model);
                };
            });
        }

        return { widgetOption, widgetEvents };
    },
    methods: {},
    mounted() {
        this.$nextTick(() => {
            this.$emit(
                "exvChange",
                this.$refs.widget[wightValues[this.widget]],
                this.$parent.model
            );
        });
    }
};
</script>
