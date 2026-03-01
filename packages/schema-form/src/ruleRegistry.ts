type RuleConfig = Record<string, unknown>
type RuleScope = 'global' | 'runtime'

const globalRuleMap: Record<string, RuleConfig> = {
  required: { required: true, message: '该字段为必填项', trigger: 'blur' },
  requiredNum: { required: true, type: 'number', message: '请输入数字', trigger: 'change' },
  email: { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  phone: {
    pattern: /^1\d{10}$/,
    message: '手机号格式不正确',
    trigger: 'blur'
  }
}

const runtimeRuleMap: Record<string, RuleConfig> = {}

export function registerSchemaRule(name: string, rule: RuleConfig, scope: RuleScope = 'global') {
  if (scope === 'runtime') {
    runtimeRuleMap[name] = rule
    return
  }
  globalRuleMap[name] = rule
}

export function getSchemaRule(name: string, localRuleMap?: Record<string, RuleConfig>) {
  return localRuleMap?.[name] || runtimeRuleMap[name] || globalRuleMap[name]
}

export function getSchemaRuleMap() {
  return { ...globalRuleMap }
}

export function getRuntimeSchemaRuleMap() {
  return { ...runtimeRuleMap }
}

export function clearRuntimeSchemaRules() {
  Object.keys(runtimeRuleMap).forEach((k) => delete runtimeRuleMap[k])
}
