<style lang="scss" scoped>

</style>
<template>
    <div style="padding:10px;">
        <div>TABLE</div>
        <exv-table v-bind="tableOption" v-on="store" ref="table"></exv-table>
    </div>
</template>
<script>
import api from "@/api";
export default {
    components: {},
    data() {
        return {
            tableOption: {
                localPage: true,
                multiToolbar: "delete",
                table: {
                    border: true,
                    columns: [
                        {
                            type: "selection",
                            width: 60,
                            align: "center"
                        },
                        {
                            type: "index",
                            width: 60,
                            align: "center"
                        },
                        {
                            type: "expand",
                            width: 50,
                            render: (h, params) => {
                                return h("div", 123);
                            }
                        },
                        {
                            title: "Name",
                            key: "name"
                        },
                        {
                            title: "Age",
                            key: "age"
                        },
                        {
                            title: "Phone",
                            key: "phone"
                        },
                        {
                            title: "Email",
                            key: "email"
                        }
                    ],
                    data() {
                        return api.User.list();
                    }
                }
            },
            store: {
                delete: async args => {
                    let ids = "";
                    if (_.isArray(args)) {
                        ids = args[0].id;
                    } else if (_.isString) {
                        ids = id;
                    } else {
                        return;
                    }
                    await api.User.delete(ids);

                    this.$refs.table.refresh();
                }
            }
        };
    },
    methods: {},
    mounted() {}
};
</script>
