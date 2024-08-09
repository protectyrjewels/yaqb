import type { IDialect } from '../dialect'
import type { Rule, RuleGroup } from '../rules'

export class MongoQB implements IDialect {
  id: string = 'mongo'

  fromQuery(query: string, options?: any): any {
    return {
      condition: "and",
      rules: [
        { field: "name", operator: "eq", value: "John" },
        { field: "age", operator: "between", value: [0, 120] }
      ]
    }
  }

  toQuery(rules: RuleGroup, options?: any): any {
    return MongoQB.transformToMongoQuery(rules);
  }

  static transformToMongoQuery(ruleGroup: RuleGroup): any {
    const operation = `$${ruleGroup.condition}`;
    const rules = ruleGroup.rules.map((rule) => {
      if ('field' in rule) { // It's a rule
        return { [rule.field]: MongoQB.toOperation(rule) };
      } else { // It's a nested RuleGroup
        return MongoQB.transformToMongoQuery(rule); // Recursive call
      }
    });

    return { [operation]: rules };
  }

  static toOperation(rule: Rule) {
    switch (rule.operator) {
      case 'eq': return { '$eq': rule.value }
      case 'between': return { '$gte': rule.value[0], '$lte': rule.value[1] };
      default:
        throw new Error(`Unsupported operator ${rule.operator}`);
    }
  }
}
