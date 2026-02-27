type RuleConfig = Record<string, unknown>

const ruleMap: Record<string, RuleConfig> = {
  required: { required: true, message: '该字段为必填项', trigger: 'blur' },
  requiredNum: { required: true, type: 'number', message: '请输入数字', trigger: 'change' },
  email: { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  phone: {
    pattern: /^1\d{10}$/,
    message: '手机号格式不正确',
    trigger: 'blur'
  }
}

export function registerSchemaRule(name: string, rule: RuleConfig) {
  ruleMap[name] = rule
}

export function getSchemaRule(name: string) {
  return ruleMap[name]
}

export function getSchemaRuleMap() {
  return { ...ruleMap }
}
