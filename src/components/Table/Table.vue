<template>
    <div>
        <i-table class="exv-table" v-bind="tableOption" v-on="tableEvents" ref="table" @on-filter-change="tableFilter" @on-sort-change="tableSort">
            <div slot="footer">
                <exv-toolbar v-if="tableSelection.length>0" class="exv-footer-mulit-toolbar" v-bind="multiToolbarOption" @click="multiToolbarClick"></exv-toolbar>
                <Page class="exv-footer-page" show-elevator show-sizer size="small" v-bind="pageOption" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </i-table>
    </div>
</template>
<script>

import _ from "lodash";

const multiToolbarDefault = {
    delete: {
        type: "text",
        text: "删除",
        confirm: "请确认删除数据",
        placement: "right-end",
        signal: "delete"
    }
};
export default {
    props: {
        table: {},
        localPage: {},
        multiToolbar: {}
    },
    data() {
        return {
            selectItems: [],
            sourceData: [],
            pageSize: 10,
            pageNum: 1,
            tableEvents: {
                "on-selection-change": this.tableSelect
            }
        };
    },
    computed: {
        tableOption() {
            let option = {
                ...this.table
            };
            if (this.localPage) {
                option.data = this.targetData;
            } else {
                option.data = this.sourceData;
            }
            return option;
        },
        targetData() {
            let start = (this.pageNum - 1) * this.pageSize;
            let end = this.pageNum * this.pageSize;
            let target = _.slice(this.sourceData, start, end) || [];

            this.selectItems = target.filter(item => {
                return item._checked;
            });
            return target;
        },
        pageOption() {
            let option = {
                current: this.pageNum,
                pageSize: this.pageSize
            };

            option.total = this.sourceData.length || 0;
            return option;
        },

        tableSelection() {
            return (
                (this.$refs.table && this.$refs.table.getSelection()) ||
                this.selectItems
            );
        },
        multiToolbarOption() {
            let option = {};

            if (_.isString(this.multiToolbar)) {
                this.multiToolbar.split(",").forEach(key => {
                    option.fields = option.fields || [];
                    if (multiToolbarDefault[key]) {
                        option.fields.push(multiToolbarDefault[key]);
                    } else {
                        throw new Error("not default toolbar type");
                    }
                });
            } else {
                option = this.multiToolbar;
            }

            return option;
        }
    },
    methods: {
        async refresh(model = {}) {
            let data = this.table.data;

            if (_.isNumber(model.pageNum)) {
                this.pageNum = model.pageNum;
            }

            if (_.isNumber(model.pageSize)) {
                this.pageSize = model.pageSize;
            }

            if (data) {
                if (_.isFunction(data)) {
                    data = await data();
                }

                if (_.isArray(data)) {
                    this.sourceData = data;
                }
            }
        },
        tableSelect(items) {
            this.selectItems = items;
        },
        pageChange(pageNum) {
            this.refresh({ pageNum });
        },
        pageSizeChange(pageSize) {
            this.refresh({ pageSize });
        },
        multiToolbarClick(signal, item) {
            this.$emit(signal, this.$refs.table.getSelection());
        },
        tableFilter() {},
        tableSort() {}
    },
    mounted() {
        this.refresh();
    }
};
</script>
