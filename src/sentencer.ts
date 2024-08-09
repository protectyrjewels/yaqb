import type { Rule, RuleGroup } from './rules'

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
      case "between":
        return `with ${rule.field} between ${rule.value[0]} and ${rule.value[1]}`;
    }
  }
}
