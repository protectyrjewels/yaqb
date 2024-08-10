import type { Rule as RuleType, Field } from '@yaqb/core';
import { operatorToTextMap, typeToOperatorsMap } from '../operators';
import { ChangeEvent, useEffect, useState } from 'react';

export type EditableRule = Field & RuleType;

export interface RuleProps {
  rule: RuleType;
  fields: Field[];
  // Function to handle rule changes
  onChange: (rule: EditableRule) => void;
  onClose: () => void;
}

const typeToInput: React.FC<{editableRule: EditableRule, onChange: (event: ChangeEvent<HTMLInputElement>) => void}> = ({ editableRule, onChange }) => {
  switch (editableRule.type) {
    case 'string':
      return <input type={editableRule.type} className='p-1.5 rounded-md' value={editableRule.value as any} onChange={onChange} />
    case 'number':
      return <input type={editableRule.type} className='p-1.5 rounded-md' value={editableRule.value as any} onChange={onChange} />
    case 'selector':
      return (<select className='p-1.5 rounded-md'>
        {editableRule.values?.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>)
    default:
      return <></>
  }
}

export const Rule: React.FC<RuleProps> = ({ rule, fields, onChange, onClose }) => {
  const [editableRule, setEditableRule] = useState<EditableRule | null>(null);
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);

  useEffect(() => {
    const field = fields.find((field) => field.field === rule.field);
    if (!field) {
      throw new Error(`Field ${rule.field} not found`);
    }

    const editableRule: EditableRule = {...field, ...rule};
    //const availableOperators: string[] = typeToOperatorsMap[field.type] || [];

    setEditableRule(editableRule);
    //setAvailableOperators(availableOperators);
  }, [rule.field, fields]);

  useEffect(() => {
    if (editableRule) {
      console.log('editableRule!', editableRule);
      console.log('available', typeToOperatorsMap[editableRule.type] || []);
      setAvailableOperators(typeToOperatorsMap[editableRule.type] || []);
      onChange(editableRule);
    }
  }, [editableRule]);

  function changeOperator(event: ChangeEvent<HTMLSelectElement>): void {
    const operator = event.target.value;
    console.log('operator', operator);
    setEditableRule({ ...editableRule, operator } as EditableRule);
  }

  function changeField(event: ChangeEvent<HTMLSelectElement>): void {
    const field = fields.find((field) => field.field === event.target.value);
    console.log('field', field);
    setEditableRule({ ...editableRule, ...field } as EditableRule);
  }

  function changeValue(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    console.log('value', value);
    setEditableRule({ ...editableRule, value } as EditableRule);
  }

  if (!editableRule) {
    return null;
  }

  return (
    <div key={editableRule.field} className='flex space-x-1 w-full'>
      <select value={editableRule.field} className='p-1.5 rounded-md' onChange={changeField}>
        {fields.map((field) => (
          <option key={field.field} value={field.field}>{field.label}</option>
        ))}
      </select>

      <select value={editableRule.operator} className='p-1.5 rounded-md' onChange={changeOperator}>
        {availableOperators.map((operator) => (
          <option key={operator} value={operator}>{operatorToTextMap[operator]}</option>
        ))}
      </select>

      {typeToInput({ editableRule, onChange: changeValue })}

      <button className='p-1.5 border rounded-md float-right' onClick={onClose}>x</button>
    </div>
  );
};