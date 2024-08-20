import { ColumnFunction, TreeConfig } from "../src/config/query-config";

export const random_example: TreeConfig = {
  Users: {
    model: "users",
    select: [
      { column: "id" },
      { column: "first_name" },
      { column: "last_name" },
      { column: "random", function: ColumnFunction.MAX, as: "random_as" },
      { column: "random_1", as: "new_as" },
    ],
    joins: [
      {
        type: "INNER",
        sourceModel: "users",
        targetModel: "countries",
        conditions: [
          { sourceField: "country_id", targetField: "id", operator: "equal" },
        ],
      },
    ],
    where: [
      { field: "${field_1}", operator: "equal", value: "Rui" },
      { field: "users.age", operator: "greater_or_equal", value: 10 },
      { field: "users.active", operator: "equal", value: true },
    ],
    groupBy: [
      "users.id",
      {
        column: "users.type",
        appendCondition: {
          fieldId: "field_1",
          valueToCompare: "random",
        },
      },
    ],
    sort: [
      {
        field: "users.id",
        order: "DESC",
      },
      {
        field: "users.first_name",
        order: "ASC",
        appendCondition: {
          fieldId: "field_1",
          valueToCompare: "random",
        },
      },
    ],
    pagination: {
      limit: 10,
      skip: 10,
    },
    mapper: {
      field_1: {
        random: "users.first_name",
        not_random: "users.last_name",
      },
    },
  },
};

export const us_example: TreeConfig = {
  Geographic: {
    model: "users",
    select: [
      { column: "id" },
      { column: "first_name" },
      { column: "last_name" },
    ],
    joins: [
      {
        type: "INNER",
        sourceModel: "users",
        targetModel: "countries",
        conditions: [
          { sourceField: "country_id", targetField: "id", operator: "equal" },
        ],
        appendCondition: {
          fieldId: "field_2",
          valueToCompare: "country",
        },
      },
      {
        type: "INNER",
        sourceModel: "users",
        targetModel: "regions",
        conditions: [
          { sourceField: "region_id", targetField: "id", operator: "equal" },
        ],
        appendCondition: {
          fieldId: "field_2",
          valueToCompare: "region",
        },
      },
    ],
    where: [
      { field: "countries.name", operator: "${field_1}", value: "${field_3}" },
      { field: "regions.name", operator: "${field_1}", value: "${field_4}" },
    ],
    mapper: {
      field_1: {
        "Is not currently in": "not_equal",
        "Is currently in": "equal",
      },
    },
  },
  Demographic: {
    model: "users",
    select: [
      { column: "id" },
      { column: "first_name" },
      { column: "last_name" },
    ],
    where: [
      { field: "users.gender", operator: "${field_2}", value: "${field_3}" },
      { field: "users.age", operator: "${field_4}", value: "${field_5}" },
      {
        field: "users.date_of_birth",
        operator: "${field_6}",
        value: "${field_7}",
      },
    ],
  },
  Behaviour: {
    model: "users",
    select: [
      { column: "id" },
      { column: "first_name" },
      { column: "last_name" },
    ],
    joins: [
      {
        type: "INNER",
        sourceModel: "users",
        targetModel: "purchased_products",
        conditions: [
          { sourceField: "id", targetField: "user_id", operator: "equal" },
        ],
      },
    ],
    where: [
      {
        field: "purchased_products.name",
        operator: "${field_1}",
        value: "${field_4}",
      },
    ],
    mapper: {
      field_1: {
        Did: "equal",
        "Didn't": "not_equal",
      },
    },
  },
};
