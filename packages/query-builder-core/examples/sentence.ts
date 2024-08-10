import { Sentencer, type RuleGroup } from '@protectyrjewels/query-builder-core'

const rules: RuleGroup = {
  condition: 'and',
  rules: [
    { field: 'name', operator: 'eq', value: 'John' },
    { field: 'age', operator: 'between', value: [0, 120] },
  ]
}

// will print: 'with name equal to "John" and with age between 0 and 120'
console.log(Sentencer.toSentence(rules));
