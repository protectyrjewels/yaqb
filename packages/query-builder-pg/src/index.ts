import type { IDialect, Rule, RuleGroup } from "@protectyrjewels/query-builder-core";
import { QueryBuilder } from "@protectyrjewels/query-builder-core";
import { format } from "@scaleleap/pg-format";

export class PostgresQB implements IDialect {
  readonly id: string = "pg";

  fromQuery(query: string, options?: any): any {
    return {
      condition: "and",
      rules: [
        { field: "name", operator: "eq", value: "John" },
        { field: "age", operator: "between", value: [0, 120] },
      ],
    };
  }

  toQuery(rules: RuleGroup, options: any = {}): any {
    // generate parameterized query by default
    const { query, params } = PostgresQB.transformToSQLQuery(rules);

    if (!options.parameterized) {
      // merge parameters into the query if not operating in parameterized mode
      return PostgresQB.interpolateQuery(query, params);
    }

    return { query, params };
  }

  static transformToSQLQuery(ruleGroup: RuleGroup) {
    let clauses: string[] = [];
    let params: any[] = [];
    let condition = ruleGroup.condition.toUpperCase();

    // iterate through each rule or nested group
    for (let rule of ruleGroup.rules) {
      if ("field" in rule) {
        // handling a simple rule
        let { queryPart, values } = PostgresQB.prepareRuleQuery(rule);
        clauses.push(queryPart);
        params = params.concat(values);
      } else {
        // handling a nested RuleGroup
        const nestedResult = PostgresQB.transformToSQLQuery(rule);
        clauses.push(`(${nestedResult.query})`);
        params = params.concat(nestedResult.params);
      }
    }

    return { query: clauses.join(` ${condition} `), params };
  }

  static prepareRuleQuery(rule: Rule): { queryPart: string; values: any[] } {
    switch (rule.operator) {
      case "eq":
        return { queryPart: `"${rule.field}" LIKE %L`, values: [rule.value] };
      case "between":
        if (Array.isArray(rule.value) && rule.value.length === 2) {
          return {
            queryPart: `"${rule.field}" >= %L AND "${rule.field}" <= %L`,
            values: rule.value,
          };
        }
        throw new Error(`Invalid value for 'between' operator: ${rule.value}`);
      default:
        throw new Error(`Unsupported operator ${rule.operator}`);
    }
  }

  static interpolateQuery(query: string, params: any[]): string {
    return format(query, ...params);
  }
}

QueryBuilder.registerDialect(new PostgresQB())

export { QueryBuilder }
