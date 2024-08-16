import type { IDialect, Rule, RuleGroup } from "@yaqb/core";
import { QueryBuilder } from "@yaqb/core";
import { format } from "@scaleleap/pg-format";

export class PostgresQB implements IDialect {
  readonly id: string = "pg";

  toQuery(rules: RuleGroup, options: any = {}): any {
    // generate parameterized query by default
    const { query, params } = PostgresQB.transformToSQLQuery(rules);

    if (!options.parameterized) {
      // merge parameters into the query if not operating in parameterized mode
      return PostgresQB.interpolateQuery(query, params);
    }

    return { query, params };
  }

  static transformToSQLQuery(ruleGroup: RuleGroup) {
    const clauses: string[] = [];
    let params: any[] = [];
    const condition = ruleGroup.condition.toUpperCase();

    // iterate through each rule or nested group
    for (const rule of ruleGroup.rules) {
      if ("field" in rule) {
        // handling a simple rule
        const { queryPart, values } = PostgresQB.prepareRuleQuery(rule);
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
      case "ne":
        return { queryPart: `"${rule.field}" NOT LIKE %L`, values: [rule.value] };
      case "gt":
        return { queryPart: `"${rule.field}" > %L`, values: [rule.value] };
      case "lt":
        return { queryPart: `"${rule.field}" < %L`, values: [rule.value] };
      case "lte":
        return { queryPart: `"${rule.field}" <= %L`, values: [rule.value] };
      case "gte":
        return { queryPart: `"${rule.field}" >= %L`, values: [rule.value] };
      case "between":
        if (Array.isArray(rule.value) && rule.value.length === 2) {
          return {
            queryPart: `"${rule.field}" >= %L AND "${rule.field}" <= %L`,
            values: rule.value,
          };
        } else if (Array.isArray(rule.value) && rule.value.length === 1) {
          return { queryPart: `"${rule.field}" = %L`, values: [rule.value] };
        }
        throw new Error(`Unsupported value for between operator: ${rule.value}`);
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
