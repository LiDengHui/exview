# exview

> A vue.js 后台管理 基于配置化思想的 vue 开发，依赖，iview ， loadsh

## 使用

    import Vue from "vue";
    import exview from "exview";

    Vue.use(exview)

## COMPONENTS

组件的特性

1. 标准化

2. 可组装

3. 可替换

4. 可维护

### FORM

需求 : 表单提交 ( 未完成 )

        <exv-form v-bind="formOptions" v-on="store"></exv-form>

       OPTIONS: { //本身依赖iview form组件，参考from的属性
            "label-width": 100,
            fields: [
                {
                    label: "输入",
                    rule: "required,username", // 数据验证规则，可为字符串和数组，当为数组时参考iview.form
                    error: "error",
                    name: "username", //为字段名称
                    showMessage: true,
                    widget: "ExvWidgetInput", //组件类型
                    option: { // 组件配置
                        placeholder: "用户名1",
                        type: "text",
                        append: '<span style="color:red;">aaa</span>',
                        disabled: false
                    },
                    events: { // 组件事件监听
                        "on-change"(e, model) {
                            this.$emit("exvChange", e.target.value);// 提交exvChange事件修改form表单值
                        }
                    },
                    watch: [
                        "username",
                        function(model) {
                            model;
                        }
                    ]
                },
                {
                    label: "密码",
                    rule: "required,password",
                    widget: "Input",
                    name: "account",
                    watch: [
                        "username",
                        function(model) {
                            model;
                        }
                    ],
                    option: {
                        type: "password",
                        placeholder: "密码",
                        append: '<span style="color:red;">aaa</span>',
                        disabled: false
                    }
                }
            ],
            toolbar: "submit,reset", //当为字符串时为默认按钮，toolbar为Toolbar组件的配置，但是当其中对应按钮添加validate:true,则进行form表单rules验证◊
            validate(model) { // 数据提交时做数据转换，数据转换为深拷贝，不会对原数据产生影像
                return model;
            }
        },

### TOOLBAR( 已完成 )

需求 : 按钮组

    <exv-toolbar v-bind="option" @click="toolbarClick"></exv-toolbar>

    OPTION:
        {
            fields: [
                {
                    type: "primary",
                    text: "提交",
                    loading: false, // loading 为是否显示button的loading状态
                    signal() { // signal 为按钮事件处理
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve("submit");
                            }, 3000);
                        });
                    },
                },
                {
                    type: "default",
                    text: "取消",
                    loading: false,
                    signal: "reset"
                }
            ]
        }
    /**
    PARAM:
        signal 参数可为函数,字符串

        signal当为函数时(e,item,index) //可为异步函数
            参数：
            this指向当前Toolbar组件
            e 为按钮点击事件
            item为当前按钮的配置项
            index为当前配置项的第几列
            返回值:
            Toolbar:click事件的第一参数
        singal 为字符串时
            直接为Toolbar:click事件的第一参数
    EVENTS:
        click(signal,item)
        signal 为按钮signal，
        item 为对应field
    */

### TABLE

需求 : 表格

1. 多选，{ 删除 : √}
2. 序号，√
3. 操作，
4. 分页 , 支持本地分页和前端分页，单页数目，页面跳转 √
5. 项目隐藏

          <exv-table v-bind="tableOption" v-on="store" ref="table"></exv-table>

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

### CRUD

需求 : 增删改查

## Build Setup

```bash
# install dependencies
npm install

# 开启数据模拟服务器
npm run serve

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the
[guide](http://vuejs-templates.github.io/webpack/) and
[docs for vue-loader](http://vuejs.github.io/vue-loader).
