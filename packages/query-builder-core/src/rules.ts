export interface Rule {
  field: string;
  operator: string;
  value: string[] | number[] | string | number | boolean;
}

export interface RuleGroup {
  condition: 'and' | 'or';
  rules: Rule[] | RuleGroup;
}
