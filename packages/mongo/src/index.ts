import type { IDialect, Rule, RuleElem, RuleGroup } from "@yaqb/core";
import { QueryBuilder } from "@yaqb/core";

export class MongoQB implements IDialect {
  readonly id: string = 'mongo'

  fromQuery(_query: string, _options?: any): any {
    return {
      condition: "and",
      rules: [
        { field: "name", operator: "eq", value: "John" },
        { field: "age", operator: "between", value: [0, 120] }
      ]
    }
  }

  toQuery(rules: RuleGroup, _options?: any): any {
    return MongoQB.transformToMongoQuery(rules);
  }

  static transformToMongoQuery(ruleGroup: RuleGroup): any {
    const operation = `$${ruleGroup.condition}`;
    const rules = ruleGroup.rules.map((rule: RuleElem) => {
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
      case 'ne': return { '$ne': rule.value }
      case 'gt': return { '$gt': rule.value }
      case 'lt': return { '$lt': rule.value }
      case 'gte': return { '$gte': rule.value }
      case 'lte': return { '$lte': rule.value }
      case 'between': {
        if (Array.isArray(rule.value) && rule.value.length === 2) {
          return { '$gte': rule.value[0], '$lte': rule.value[1] };
        } else if (Array.isArray(rule.value) && rule.value.length === 1) {
          return { '$eq': rule.value[0] };
        }
        throw new Error(`Invalid value for 'between' operator: ${rule.value}`);
      }
      default:
        throw new Error(`Unsupported operator ${rule.operator}`);
    }
  }
}

QueryBuilder.registerDialect(new MongoQB())

export { QueryBuilder }
