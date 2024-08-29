import { Builder } from '@yaqb/ui-react'
import { Field, RuleGroup } from '@yaqb/core';
import { PrimitiveType } from '@yaqb/core/src/fields';

async function fetchPokemonNames(): Promise<PrimitiveType[]> {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.results.map((pokemon: { name: string }) => ({ label: pokemon.name, value: pokemon.name }));
}

const rules: RuleGroup = {
  condition: 'and',
  rules: [
    { field: 'name', operator: 'eq', value: ['John'] },
    { field: 'age', operator: 'gt', value: [20] },
    { field: 'gender', operator: 'eq', value: ['famale'] }
  ]
}

const fields: Field[] = [
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
    type: "enum",
    value: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
    metadata: { category: "demographic" },
  },
  {
    field: "favorite_color",
    label: "Favorite Color",
    type: "enum",
    value: [
      { label: "Red", value: "red" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
    ],
    conditions: [
      {
        field: 'gender',
        value: 'male'
      }
    ],
    metadata: { category: "demographic" },
  },
  {
    field: "pokemon",
    label: "Favorite Pokemon",
    type: "enum",
    value: fetchPokemonNames,
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
  }
]

function App() {
  return (
    <div style={{margin: "50px"}}>
      <h1 style={{fontSize: "2rem"}}>
        <strong>@yaqb/ui-react demo</strong>
      </h1>
      <div style={{fontSize: "1rem", marginTop: "10px", marginBottom: "20px" }}>
        <em>Yet Another Query Builder</em> is a React component that allows users to build complex queries with an intuitive UI.
      </div>

      <Builder rules={rules} fields={fields} />
    </div>
  )
}

export default App
