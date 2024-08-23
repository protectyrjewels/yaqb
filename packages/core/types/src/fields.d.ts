export interface Condition {
    field: string;
    value: string | number;
}
export type PrimitiveType = string | number;
export type Labelled<T> = {
    label: string;
    value: T;
};
export type FieldValue = Array<PrimitiveType | Labelled<PrimitiveType>> | (() => Promise<Array<PrimitiveType | Labelled<PrimitiveType>>>);
export interface Field {
    field: string;
    label: string;
    type: string;
    value?: FieldValue;
    defaultValue?: FieldValue;
    conditions?: Condition[];
    metadata?: any;
    format?: string;
    validations?: any[];
}
export declare function determineVisibleFields(fields: Field[], selections: {
    [key: string]: any;
}): Field[];
