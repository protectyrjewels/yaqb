import { RuleGroup } from "@yaqb/core";
import { Builder } from "@yaqb/ui-react";

const rules: RuleGroup = {
  condition: "and",
  rules: [
    { field: "name", operator: "eq", value: "John" },
    { field: "age", operator: "gt", value: 20 },
  ],
};

const fields = [
  {
    field: "name",
    label: "Name",
    type: "string",
    metadata: { category: "demographic" },
  },
  {
    field: "age",
    label: "Age",
    type: "number",
    metadata: { category: "demographic" },
    validations: [
      { type: "min", value: 0 },
      { type: "max", value: 120 },
    ],
  },
  {
    field: "gender",
    label: "Gender",
    type: "selector",
    values: ["Male", "Female"],
    metadata: { category: "demographic" },
  },
  {
    field: "lives_in",
    label: "Lives in",
    type: "string",
    metadata: { category: "geographic" },
  },
  {
    field: "works_in",
    label: "Works in",
    type: "string",
    metadata: { category: "geographic" },
  },
];

function App() {
  return (
    <div style={{ margin: "50px" }}>
      <h1 style={{ fontSize: "2rem" }}>
        <strong>@yaqb/ui-react demo</strong>
      </h1>
      <div
        style={{ fontSize: "1rem", marginTop: "10px", marginBottom: "20px" }}
      >
        <em>Yet Another Query Builder</em> is a React component that allows
        users to build complex queries with an intuitive UI.
      </div>

      <Builder rules={rules} fields={fields} />
    </div>
  );
}

export default App;
