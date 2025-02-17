import type { Field, RuleGroup } from "@yaqb/core"

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
    value: ["Male", "Female"],
  },
];

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

export const rules3: RuleGroup = {
  condition: 'and',
  rules: [
    { field: 'name', operator: 'eq', value: 'John' },
    { field: 'age', operator: 'gt', value: 45 },
  ]
}
