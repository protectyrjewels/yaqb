import type { IDialect, Rule, RuleGroup } from "@protectyrjewels/query-builder-core";
import { QueryBuilder } from "@protectyrjewels/query-builder-core";
export declare class MongoQB implements IDialect {
    readonly id: string;
    fromQuery(query: string, options?: any): any;
    toQuery(rules: RuleGroup, options?: any): any;
    static transformToMongoQuery(ruleGroup: RuleGroup): any;
    static toOperation(rule: Rule): {
        $eq: string | number | boolean | number[] | string[];
        $gte?: undefined;
        $lte?: undefined;
    } | {
        $gte: string | number;
        $lte: string | number;
        $eq?: undefined;
    };
}
export { QueryBuilder };
