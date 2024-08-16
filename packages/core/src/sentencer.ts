import type { Rule, RuleGroup } from './rules'

export class Sentencer {
  static toSentence(rules: RuleGroup): string {
    return Sentencer.translateRulesToSentence(rules);
  }

  static translateRulesToSentence(ruleGroup: RuleGroup): string {
    const clauses = [];

    for (const rule of ruleGroup.rules) {
      if ("field" in rule) {
        clauses.push(Sentencer.translateRuleToSentence(rule));
      } else {
        // it's a nested RuleGroup
        const nestedSentence = Sentencer.translateRulesToSentence(rule);
        clauses.push(`(${nestedSentence})`);
      }
    }

    // join all clauses using the group's condition (' AND ' or ' OR ')
    return clauses.join(` ${ruleGroup.condition.toLowerCase()} `);
  }

  static translateRuleToSentence(rule: Rule): string {
    switch (rule.operator) {
      case "eq":
        return `with ${rule.field} equal to "${rule.value}"`;
      case "ne":
        return `with ${rule.field} not equal to "${rule.value}"`;
      case "gt":
        return `with ${rule.field} greater than ${rule.value}`;
      case "lt":
        return `with ${rule.field} less than ${rule.value}`;
      case "gte":
        return `with ${rule.field} greater than or equal to ${rule.value}`;
      case "lte":
        return `with ${rule.field} less than or equal to ${rule.value}`;
      case "between":
	      if (Array.isArray(rule.value) && rule.value.length === 2) {
          return `with ${rule.field} between ${rule.value[0]} and ${rule.value[1]}`;
        } else {
          return `with ${rule.field} between ${rule.value}`;
        }
      default:
	      throw new Error("Unsupported operator")
    }
  }
}
