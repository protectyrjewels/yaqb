export type PrimitiveType = string | number;
export type FieldValue = Array<PrimitiveType> | (() => Promise<Array<PrimitiveType>>);
export interface Field {
    field: string;
    label: string;
    type: string;
    value?: FieldValue;
    defaultValue?: FieldValue;
    metadata?: any;
    format?: string;
    validations?: any[];
}
