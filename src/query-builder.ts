import type { Field } from './fields'
import type { IDialect } from './dialect'
import type { RuleGroup } from './rules'
import { DialectManager } from './dialect'
import { Sentencer } from './sentencer'
import { dialects } from './dialects'

dialects.forEach((dialect: IDialect) => {
  DialectManager.registerDialect(dialect.id, dialect);
});

export class QueryBuilder {
  public rules: RuleGroup;
  public fields: Field[];

  constructor(rules: RuleGroup, fields: Field[]) {
    this.rules = rules; 
    this.fields = fields; 
  }

  fromQuery(dialect: string, query: string, options?: any) {
    const qb = DialectManager.getDialect(dialect) 
    return qb.fromQuery(query, options)
  }

  toQuery(dialect: string, options: any) {
    const qb = DialectManager.getDialect(dialect) 
    return qb.toQuery(this.rules, options)
  }

  toSentence(): string {
    return Sentencer.toSentence(this.rules);
  }
}
