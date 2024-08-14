import { IDialect, QueryBuilder, RuleGroup } from "@yaqb/core";
export declare class QueryResolver implements IDialect {
    config: {
        conjunctions: import("@react-awesome-query-builder/core").CoreConjunctions;
        operators: import("@react-awesome-query-builder/core").CoreOperators;
        widgets: import("@react-awesome-query-builder/core").CoreWidgets;
        types: import("@react-awesome-query-builder/core").CoreTypes;
        settings: import("@react-awesome-query-builder/core").Settings;
        ctx: import("@react-awesome-query-builder/core").ConfigContext;
        fields: import("@react-awesome-query-builder/core").Fields;
        funcs?: import("@react-awesome-query-builder/core").Funcs;
    };
    initialTree: import("@react-awesome-query-builder/core").ImmutableTree<import("@react-awesome-query-builder/core")._TreeI>;
    fromQuery(query: any, options?: any): void;
    toQuery(rules: RuleGroup, options?: any): Object | undefined;
    readonly id: string;
}
export { QueryBuilder };
