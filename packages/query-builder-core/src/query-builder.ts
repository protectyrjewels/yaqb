import type { Field } from './fields'
import type { IDialect } from './dialect'
import type { RuleGroup } from './rules'
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

  fromQuery(dialect: string, query: any, options?: any) {
    const qb = DialectManager.getDialect(dialect) 
    if (!qb) throw new Error(`Unknown dialect '${dialect}'`);
    return qb.fromQuery(query, options)
  }

  toQuery(dialect: string, options: any = {}) {
    const qb = DialectManager.getDialect(dialect) 
    if (!qb) throw new Error(`Unknown dialect '${dialect}'`);
    return qb.toQuery(this.rules, options)
  }

  toSentence(): string {
    return Sentencer.toSentence(this.rules);
  }
}
