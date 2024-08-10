import type { Rule, RuleGroup } from './rules';
export declare class Sentencer {
    static toSentence(rules: RuleGroup): string;
    static translateRulesToSentence(ruleGroup: RuleGroup): string;
    static translateRuleToSentence(rule: Rule): string;
}
