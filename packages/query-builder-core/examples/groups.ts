// groups example:

// collection of options for each statement
const fields: Field[] = [
  { field: 'name', label: 'Name', type: 'string' },
  { field: 'age', label: 'Age', type: 'number', validations: [{ type: "min", value: 0}, { type: "max", value: 120} ]},
  { field: 'gender', label: 'Gender', type: 'selector', values: ['Male', 'Female'] }
]

// specific UI state of a query builder
// notice that not all fields are being used. if the user click on "Add new rule" we can select 'gender' for instance
// notice also that for a given type of field there is a predefined number of operators implemented. eg: for a field
// with type 'string' we have 'eq', 'neq', 'in', etc.
const rules: RuleGroup = {
  condition: 'and',
  rules: [
    { field: 'name', operator: 'eq', value: 'John' },
    { field: 'age', operator: 'between', value: [0, 120] },
    {
      condition: 'or',
      rules: [
        { field: 'gender', operator: 'eq', value: 'Female' },
        { field: 'gender', operator: 'eq', value: 'Male' }
      ]
    }
  ]
}

const qb = new QueryBuilder(rules, fields);

console.log(qb.toSentence());

