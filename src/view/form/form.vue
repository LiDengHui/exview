<style lang="scss" scoped>

</style>
<template>
    <div>
        FORM
        <exv-form v-bind="formOptions" v-on="store"></exv-form>
    </div>
</template>
<script>
import api from "@/api";
export default {
    components: {},
    data() {
        let random = ~~(Math.random() * 10);

        return {
            formOptions: {
                "label-width": 100,
                fields: [
                    {
                        label: "姓名",
                        rule: "required",
                        name: "name",
                        widget: "Input",
                        option: {
                            placeholder: "姓名",
                            type: "text",
                            value: `lidenghui${random}`
                        }
                    },
                    {
                        label: "年龄",
                        rule: "requiredNum",
                        widget: "InputNumber",
                        name: "sex",
                        option: {
                            max: 100,
                            min: 0,
                            placeholder: "age",
                            value: 32
                        }
                    },
                    {
                        label: "电话",
                        rule: "required,phone",
                        widget: "Input",
                        name: "phone",
                        option: {
                            type: "text",
                            placeholder: "电话",
                            value: `1320165668${random}`
                        }
                    },
                    {
                        label: "邮箱",
                        rule: "required,email",
                        widget: "Input",
                        name: "email",
                        option: {
                            type: "text",
                            placeholder: "邮箱",
                            value: `337948903${random}@qq.com`
                        }
                    }
                ],
                toolbar: "submit,reset",
                validate(model) {
                    return model;
                }
            },
            store: {
                submit: async model => {
                    console.dir(model);
                    debugger;
                    let res = await api.User.add(model);

                    this.$Message.info({
                        content: JSON.stringify(res)
                    });
                },
                reset: model => {
                    this.$Message.info({
                        content: JSON.stringify(model)
                    });
                }
            }
        };
    },
    methods: {},
    mounted() {}
};
</script>
