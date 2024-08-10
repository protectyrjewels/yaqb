export interface Rule {
  field: string;
  operator: string;
  value: string[] | number[] | string | number | boolean;
}

export type RuleElem = Rule | RuleGroup

export interface RuleGroup {
  condition: 'and' | 'or';
  rules: RuleElem[];
}
