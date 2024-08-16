import type { Field } from './fields'
import type { IDialect } from './dialect'
import type { Rule, RuleGroup } from './rules'
import { DialectManager } from './dialect'
import { Sentencer } from './sentencer'

export class QueryBuilder {
  public rules: RuleGroup;
  public fields: Field[];

  constructor(rules: RuleGroup, fields: Field[]) {
    this.rules = rules; 
    this.fields = fields; 
  }

  static registerDialect(dialect: IDialect) {
    DialectManager.registerDialect(dialect.id, dialect);
  }

  withNewRule(newRule: Rule) {
    const rules = [...this.rules.rules, newRule];
    return new QueryBuilder({...this.rules, rules}, this.fields);
  }

  setRule(index: number, rule: any) {
    const rules = this.rules.rules.map((r, i) => i === index ? rule : r);
    return new QueryBuilder({...this.rules, rules}, this.fields);
  }

  withoutRule(index: number) {
    const rules = this.rules.rules.filter((_, i) => i !== index);
    return new QueryBuilder({...this.rules, rules}, this.fields);
  }

  toQuery(dialect: string, options: any = {}) {
    const qb = DialectManager.getDialect(dialect) 
    if (!qb) throw new Error(`Unknown dialect '${dialect}'`);
    return qb.toQuery(this.rules, options)
  }

  toSentence(): string {
    return Sentencer.toSentence(this.rules);
  }
}
