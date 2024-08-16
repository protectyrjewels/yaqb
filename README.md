# Yet Another Query Builder

<p>
  <a href="https://github.com/protectyrjewels/yaqb/actions/workflows/ci.yaml" alt="CI">
    <img src="https://github.com/protectyrjewels/yaqb/actions/workflows/ci.yaml/badge.svg" />
  </a>
</p>

Yet Another Query Builder is an adaptable tool that assists developers in constructing SQL and MongoDB queries directly from structured rules. Moreover, it articulates the complex query logic into a human-readable natural language sentence, enhancing understandability and documentation.

## Features

- Supports generating both SQL (Postgres) queries and MongoDB queries
- Generates a natural language description of a set of rules

## Roadmap

- Supporting generating rule groups from queries

## Examples

```typescript
import { QueryBuilder, type Field, type RuleGroup } from '@yaqb/pg'

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
    type: "enum",
    value: ["Male", "Female"],
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

const { query, params } = qb.toQuery({ parameterized: true });
console.log(query);
// will output => `"name" LIKE %L AND "age" >= %L AND "age" <= %L`
console.log(params);
// will output => ["John", 0, 120]

```

If you want to support multiple query providers, you need to register the providers like this:

```typescript
import { QueryBuilder, type Field, type RuleGroup } from '@yaqb/core'
import { MongoDB } from '@yaqb/mongo'
import { PostgresQB } from '@yaqb/pg'

QueryBuilder.registerDialect(new MongoQB())
QueryBuilder.registerDialect(new PostgresQB())

// you can now generate queries for both providers:
// qb.toQuery('mongo')
// qb.toQuery('pg')

```

If you just want a natural language sentence of the rule group, you can:

```typescript
import { Sentencer, type RuleGroup } from '@yaqb/core'

const rules: RuleGroup = {
  condition: 'and',
  rules: [
    { field: 'name', operator: 'eq', value: 'John' },
    { field: 'age', operator: 'between', value: [0, 120] },
  ]
}

// will print: 'with name equal to "John" and with age between 0 and 120'
console.log(Sentencer.toSentence(rules));
```

## License

This software is licensed under the MIT license. See [LICENSE](./LICENSE) for details.
