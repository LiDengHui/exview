// 密码正则
export const passwordRegex = /^(\w)(\S){5,19}$/;

// 验证码正则
export const capthaRegex = /^\d{4}$/;

// 电话正则
export const phoneRegex = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

// 用户名正则
export const username = /^[\w|\u4E00-\uFA29|\uE7C7-\uE7F3]{2,16}$/;

// QQ号正则
export const qqRegex = /^[1-9][0-9]{4,9}$/;

export default {
    required: { required: true, message: "不能为空", trigger: "blur" },
    phone: { pattern: phoneRegex, message: "手机号不合法", trigger: "blur" },
    username: {
        pattern: username,
        message: "用户名必须是2-16位中文或数字或字母或下划线开头",
        trigger: "blur"
    },
    password: {
        pattern: passwordRegex,
        message: "密码必须为6到20位数字或字母开头字符串",
        trigger: "blur"
    },
    captha: {
        pattern: capthaRegex,
        message: "验证码为4位数字",
        trigger: "blur"
    },
    requiredDate: {
        type: "date",
        required: true,
        message: "输入不能为空",
        trigger: "blur"
    },
    requiredNum: {
        type: "number",
        message: "输入不能为空,且为数字",
        trigger: "blur"
    },
    email: { type: "email", message: "邮箱输入不合法", trigger: "blur" },
    qqNum: { pattern: qqRegex, message: "QQ号码输入不合法", trigger: "blur" },
    sigleImg: {
        type: "array",
        required: true,
        len: 1,
        trigger: "blur",
        message: "图片不能为空"
    }
};
