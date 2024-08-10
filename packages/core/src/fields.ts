export interface Field {
  field: string;
  label: string;
  type: string;
  metadata?: any;

  // default value
  default?: string[] | number[] | string | number | boolean;
  // in case of selectors
  values?: any[];
  // in case of strings
  format?: string;
  // validations
  validations?: any[]
}
