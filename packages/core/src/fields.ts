export interface Condition {
  field: string;
  value: string | number;
}

export type PrimitiveType = string | number;

export type Labelled<T> = { label: string; value: T };

export type FieldValue = Array<PrimitiveType | Labelled<PrimitiveType>> | (() => Promise<Array<PrimitiveType | Labelled<PrimitiveType>>>);

export interface Field {
  field: string;
  label: string;
  type: string;
  value?: FieldValue;
  defaultValue?: FieldValue;
  conditions?: Condition[];
  metadata?: any;
  // in case of strings
  format?: string;
  // validations
  validations?: any[]
}

export function determineVisibleFields(fields: Field[], selections: { [key: string]: any }): Field[] {
  const isFieldVisible = (field: Field): boolean => {
    // Visible if no conditions
    if (!field.conditions) {
      return true;
    }
    return field.conditions.some(condition =>
      selections[condition.field] === condition.value
    );
  };
  return fields.filter(field => isFieldVisible(field))
}
