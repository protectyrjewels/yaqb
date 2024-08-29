import type { Field, RuleGroup } from "../src/index";

export const fields: Field[] = [
  { field: "name", label: "Name", type: "string" },
  {
    field: "age",
    label: "Age",
    type: "number",
    validations: [
      { type: "min", value: 0 },
      { type: "max", value: 120 },
    ],
  },
  {
    field: "gender",
    label: "Gender",
    type: "enum",
    value: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
];

export const complexFields: Field[] = [
  {
    label: "Did you do it?",
    field: "did",
    type: "enum",
    value: [
      { label: "Did", value: "did" },
      { label: "Didn't", value: "didnt" },
    ]
  },
  {
    label: "Action",
    field: "action",
    type: "enum",
    value: [
      { label: "Login", value: "login" },
      { label: "Sign Up", value: "sign_up" },
      { label: "Total Purchased Value", value: "total_purchased_value" },
      { label: "Visited Product", value: "visited_product" },
      { label: "Add to Cart", value: "add_to_cart" },
   ]
  },
  {
    label: "Operation",
    field: "operation",
    type: "enum",
    value: [
      { label: "Greater than", value: "greater_than" },
      { label: "Less than", value: "less_than" },
      { label: "Equal to", value: "equal_to" },
    ],
    conditions: [
      {
        field: "action",
        value: "Total Purchased Value"
      }
    ],
  },
  {
    label: "Amount",
    field: "amount",
    type: "number",
    conditions: [
      {
        field: "operation",
        value: "Greater than"
      },
      {
        field: "operation",
        value: "Less than"
      },
    ]
  },
  {
    label: "Currency",
    field: "currency",
    type: "enum",
    value: [
      { label: "USD", value: "usd" },
      { label: "EUR", value: "eur" },
      { label: "GBP", value: "gbp" },
    ],
    conditions: [
      {
        field: "operation",
        value: "Greater than"
      },
      {
        field: "operation",
        value: "Less than"
      },
    ]
  }
]

export const rules: RuleGroup = {
  condition: "and",
  rules: [
    { field: "name", operator: "eq", value: "John" },
    { field: "age", operator: "between", value: [0, 120] },
  ],
};

export const rules2: RuleGroup = {
  condition: "and",
  rules: [
    { field: "name", operator: "eq", value: "John" },
    { field: "age", operator: "between", value: [0, 120] },
    {
      condition: "or",
      rules: [
        { field: "gender", operator: "eq", value: "Female" },
        { field: "gender", operator: "eq", value: "Male" },
      ],
    },
  ],
};
