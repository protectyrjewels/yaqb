export interface Mapper {
  [key: string]: { [key: string]: string };
}

export interface Condition {
  field: string;
  operator: string; // ENUM
  value: string;
}

export interface JoinCondition {
  sourceField: string;
  targetField: string;
  operator: string; // ENUM
}

export interface AppendJoinCondition {
  fieldId: string;
  valueToCompare: string;
}

export interface SelectConfig {
  column: string;
  function?: string; // ENUM
  as?: string;
}

export interface JoinConfig {
  type: string; // e.g., INNER, LEFT, RIGHT, FULL - ENUM
  sourceModel: string;
  targetModel: string;
  conditions: JoinCondition[];
  appendCondition?: AppendJoinCondition;
  select?: SelectConfig[];
}

export interface PaginationConfig {
  skip?: number;
  limit: number;
}

export interface SortDefault {
  type?: "default";
  /**
   * Field to sort
   */
  field: string;
  /**
   * Sort order to sort.
   * @default 'ASC' if undefined
   */
  order?: "ASC" | "DESC";
  /**
   * The nulls options can be used to determine whether nulls appear before or after non-null values in the sort ordering.
   * By default, null values sort as if larger than any non-null value; that is, NULLS FIRST is the default for DESC order, and NULLS LAST otherwise.
   */
  nulls?: "FIRST" | "LAST";
}
/**
 * Array method. Used to order by any array of value.
 */
export interface SortArrayOrder {
  type: "array-order";
  /**
   * Field to sort
   */
  field: string;
  /**
   * Array used as argument to sort
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  array: any[];
  /**
   * Sort order to sort.
   * @default 'ASC' if undefined
   */
  order?: "ASC" | "DESC";
}

export type SortConfig = (SortDefault | SortArrayOrder) & {
  appendCondition?: AppendJoinCondition;
};

export interface GroupByConfig {
  column: string;
  appendCondition?: AppendJoinCondition;
}

export interface Config {
  model: string;
  select: SelectConfig[];
  joins?: JoinConfig[];
  where?: Condition[];
  pagination?: PaginationConfig;
  sort?: Array<SortConfig>;
  groupBy?: Array<string | GroupByConfig>;
  mapper?: Mapper;
}

export interface TreeConfig {
  [key: string]: Config;
}

export const example_query_config: TreeConfig = {
  Geographic: {
    model: "user",
    select: [{ column: "id" }, { column: "name" }],
    joins: [
      {
        type: "LEFT",
        sourceModel: "user",
        targetModel: "orders",
        conditions: [
          { sourceField: "id", targetField: "user_id", operator: "equals" },
        ],
      },
      {
        type: "LEFT",
        sourceModel: "user",
        targetModel: "orders",
        conditions: [
          { sourceField: "id", targetField: "user_id", operator: "equals" },
        ],
        appendCondition: {
          fieldId: "field_5",
          valueToCompare: "orders",
        },
      },
      {
        type: "LEFT",
        sourceModel: "user",
        targetModel: "${field_6}",
        conditions: [
          { sourceField: "id", targetField: "user_id", operator: "equals" },
        ],
        appendCondition: {
          fieldId: "field_7",
          valueToCompare: "${field_6}",
        },
      },
      {
        type: "LEFT",
        sourceModel: "user",
        targetModel: "${field_8}",
        conditions: [
          { sourceField: "id", targetField: "${field_9}", operator: "equals" },
        ],
        appendCondition: {
          fieldId: "field_10",
          valueToCompare: "${field_8}",
        },
      },
      {
        type: "LEFT",
        sourceModel: "user",
        targetModel: "${field_11}",
        conditions: [
          {
            sourceField: "${field_12}",
            targetField: "${field_13}",
            operator: "equals",
          },
        ],
        appendCondition: {
          fieldId: "field_14",
          valueToCompare: "${field_15}",
        },
      },
    ],
    where: [
      {
        field: "${field_1}",
        operator: "${field_2}",
        value: "${field_3}",
      },
      {
        field: "region",
        operator: "equal",
        value: "${field_4}",
      },
    ],
    pagination: {
      limit: 10,
    },
    sort: [
      {
        field: "field_99",
        appendCondition: {
          fieldId: "field_99",
          valueToCompare: "random",
        },
      },
    ],
    groupBy: [
      "column_random",
      {
        column: "random_1",
        appendCondition: {
          fieldId: "field_98",
          valueToCompare: "random",
        },
      },
    ],
    mapper: {
      field_2: {
        "Is not currently in": "not_equal",
        "Is currently in": "equal",
      },
    },
  },
};
