# Query Builder

Query Builder is an adaptable tool that assists developers in constructing SQL and MongoDB queries directly from structured rules. Moreover, it articulates the complex query logic into a human-readable natural language sentence, enhancing understandability and documentation.

## Features

- Supports generating both SQL (Postgres) queries and MongoDB queries
- Generates a natural language description of a set of rules

## Example

```typescript
import { QueryBuilder, type Field, type RuleGroup } from 'query-builder'

const fields: Field[] = [
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
    type: "selector",
    values: ["Male", "Female"],
  }
]

const rules: RuleGroup = {
  condition: "and",
  rules: [
    { field: "name", operator: "eq", value: "John" },
    { field: "age", operator: "between", value: [0, 120] },
  ]
}

const qb = new QueryBuilder(rules, fields);

const { query, params } = qb.toQuery('pg', { parameterized: true });
console.log(query);
// will output => `"name" LIKE %L AND "age" >= %L AND "age" <= %L`
console.log(params);
// will output => ["John", 0, 120]

```

## LICENSE

This software is licensed under the MIT license. See [LICENSE](./LICENSE) for details.
