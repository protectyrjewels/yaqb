import type { IDialect, Rule, RuleGroup } from "@protectyrjewels/query-builder-core";
import { QueryBuilder } from "@protectyrjewels/query-builder-core";
export declare class PostgresQB implements IDialect {
    readonly id: string;
    fromQuery(query: string, options?: any): any;
    toQuery(rules: RuleGroup, options?: any): any;
    static transformToSQLQuery(ruleGroup: RuleGroup): {
        query: string;
        params: any[];
    };
    static prepareRuleQuery(rule: Rule): {
        queryPart: string;
        values: any[];
    };
    static interpolateQuery(query: string, params: any[]): string;
}
export { QueryBuilder };
