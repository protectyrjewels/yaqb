export interface Field {
    field: string;
    label: string;
    type: string;
    default?: string[] | number[] | string | number | boolean;
    values?: any[];
    format?: string;
    validations?: any[];
}
