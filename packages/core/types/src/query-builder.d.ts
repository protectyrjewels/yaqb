import type { Field } from './fields';
import type { IDialect } from './dialect';
import type { Rule, RuleGroup } from './rules';
export declare class QueryBuilder {
    rules: RuleGroup;
    fields: Field[];
    constructor(rules: RuleGroup, fields: Field[]);
    static registerDialect(dialect: IDialect): void;
    withNewRule(newRule: Rule): QueryBuilder;
    setRule(index: number, rule: any): QueryBuilder;
    withoutRule(index: number): QueryBuilder;
    toQuery(dialect: string, options?: any): any;
    toSentence(): string;
}
