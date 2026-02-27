<template>
    <div class="exv-toolbar">
        <template v-for="(item,index) in items">
            <Poptip v-if="item.confirm" confirm :key="index" :title="item.confirm" :placement="item.placement" @on-ok="confirmOk(item,index)" @on-cancel="confirmCancel(item,index)">
                <Button v-bind="item" ref="button">{{item.text}}</Button>
            </Poptip>
            <Button v-else :key="index" v-bind="item" @click="e=>itemEvents(e,index)" ref="button">{{item.text}}</Button>
        </template>
    </div>
</template>
<script>
import _ from "lodash";

export default {
    props: {
        fields: {}
    },
    components: {},
    data() {
        let items = this.fields;
        return {
            items
        };
    },
    computed: {},
    methods: {
        async confirmOk(item, index) {
            this.itemEvents({}, index);
        },
        confirmCancel(item, index) {},
        async itemEvents(e, index) {
            let item = this.items[index];

            if (item.confirm) {
            }
            if (item && item.signal) {
                let signal = item.signal;

                if (_.isFunction(signal)) {
                    try {
                        item.loading = true;
                        let res = await signal.call(this, e, item, index);
                        signal = res;
                    } catch (e) {
                        throw e;
                    } finally {
                        item.loading = false;
                    }
                }

                if (_.isString(signal)) {
                    this.$emit("click", signal, item);
                }
            }
        }
    },
    mounted() {}
};
</script>
