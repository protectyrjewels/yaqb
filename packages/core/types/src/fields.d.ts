export interface Field {
    field: string;
    label: string;
    type: string;
    metadata?: any;
    default?: string[] | number[] | string | number | boolean;
    values?: any[];
    format?: string;
    validations?: any[];
}
