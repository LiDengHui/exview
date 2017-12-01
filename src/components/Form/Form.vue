<template>
    <Form v-bind="formOption" class="exv-form" ref="form">
        <exv-form-item v-for="(item,index) in itemsOption" :key="index" v-bind="item" :class="item.class" :style="item.style" v-on="formItemEvents(item)"></exv-form-item>
        <form-item class="exv-form-toolbar">
            <exv-toolbar v-bind="toolbarOption" @click="toolbarClick"></exv-toolbar>
        </form-item>
    </Form>
</template>
<script>
/** @flow */

import _ from "lodash";
import { validateRules } from "@/commons/utils";
const toolbarDefault = {
    submit: {
        type: "primary",
        text: "提交",
        signal: "submit",
        validate: true
    },
    reset: {
        type: "default",
        text: "取消",
        loading: false,
        signal: "reset"
    }
};

export default {
    props: {
        inline: {},
        labelPosition: {},
        labelWidth: {},
        showMessage: {},
        autocomplete: {},
        fields: {
            default() {
                return {};
            }
        },
        toolbar: {},
        validate: {}
    },
    components: {},
    data() {
        const model = this.model || {};
        const itemsOption = this.fields;
        let toolbarOption = {};

        if (_.isString(this.toolbar)) {
            this.toolbar.split(",").forEach(key => {
                toolbarOption.fields = toolbarOption.fields || [];
                if (toolbarDefault[key]) {
                    toolbarOption.fields.push(toolbarDefault[key]);
                } else {
                    throw new Error("not default toolbar type");
                }
            });
        } else {
            toolbarOption = this.toolbar;
        }

        return {
            model,
            itemsOption,
            toolbarOption
        };
    },
    computed: {
        rules() {
            let fields = this.fields;
            let rules = {};
            fields.forEach(item => {
                rules[item.name] = [];

                if (item.rule && _.isString(item.rule)) {
                    let rulesName = item.rule.split(",");
                    rulesName.forEach(key => {
                        if (!validateRules[key]) {
                            throw new Error(
                                `validateRules is not defined ${key}`
                            );
                        }
                        rules[item.name].push(validateRules[key]);
                    });
                } else if (_.isArray(item.rule)) {
                    rules[item.name] = item.rule;
                }
            });

            return rules;
        },
        formOption() {
            return {
                ...this.$props,
                rules: this.rules,
                model: this.model
            };
        }
    },
    methods: {
        formItemEvents(item) {
            return {
                exvChange: value => {
                    this.model[item.name] = value;
                }
            };
        },
        toolbarClick(signal, item) {
            let model = _.cloneDeep(this.model);

            if (item.validate) {
                //校验表单
                this.$refs.form.validate(async valid => {
                    if (valid && _.isFunction(this.validate)) {
                        try {
                            model = await this.validate(model, signal, item);
                        } catch (e) {
                            throw e;
                            valid = false;
                        }
                    }
                    if (!valid) {
                        this.$Message.error("表单验证失败");
                    }
                });
            }

            this.$emit(signal, model);
        }
    },
    mounted() {}
};
</script>
