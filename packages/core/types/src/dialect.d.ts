import type { RuleGroup } from './rules';
export interface IDialect {
    readonly id: string;
    fromQuery(query: any, options?: any): any;
    toQuery(rules: RuleGroup, options?: any): any;
}
export declare class DialectManager {
    private static dialects;
    static registerDialect(name: string, dialect: IDialect): void;
    static getDialect(name: string): IDialect | undefined;
}
