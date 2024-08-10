import type { Rule, Field } from '@yaqb/core';
import { useEffect, useMemo, useState } from 'react';
import { operatorToTextMap, typeToOperatorsMap } from '../operators';
import CloseIcon from '../icons/close';
import { useQuery } from '../contexts/query';

export interface CustomRuleProps {
  title: string;
  rule: Rule;
  fields: Field[];
  ruleIndex: number;

  closeRule: () => void;
}

export const CustomRule: React.FC<CustomRuleProps> = ({ title, ruleIndex, rule: initialRule, fields, closeRule }) => {
  const { queryBuilder, setQueryBuilder } = useQuery();
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);
  const [rule, setRule] = useState<Rule>(initialRule);
  const operatorType = useMemo(() => {
    const field = fields.find((field) => field.field === rule.field);
    if (!field) {
      throw new Error(`Field ${rule.field} not found`);
    }
    
    switch (field.type) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'string':
      default:
        return 'text';
    }
  }, [rule.field, fields]);
  
  useEffect(() => {
    const field = fields.find((field) => field.field === rule.field);
    if (!field) {
      throw new Error(`Field ${rule.field} not found`);
    }
    setAvailableOperators(typeToOperatorsMap[field.type] || []);
  }, [rule.field, fields]);

  useEffect(() => {
    setQueryBuilder(queryBuilder.setRule(ruleIndex, rule));
  }, [rule]);

  const updateField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRule({ ...rule, field: e.target.value });
  }

  const updateOperator = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRule({ ...rule, operator: e.target.value });
  }

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'number') {
      setRule({ ...rule, value: Number(e.target.value) });
    } else if (type === 'boolean') {
      setRule({ ...rule, value: e.target.value === 'true' });
    } else {
      setRule({ ...rule, value: e.target.value });
    }
  }

  return (<div className="flex flex-col p-2 space-y-2 rounded-md border border-gray-200 text-gray-600">
    <div className="py-1.5 px-2 text-gray-500 font-medium">{title}</div>

    <div className='mx-2 pb-2 flex space-x-2 w-full'>
      <select value={rule.field} className='p-1.5 rounded bg-[#F8F8FB]' onChange={updateField}>
        {fields.map((field) => (
          <option key={field.field} value={field.field}>{field.label}</option>
        ))}
      </select>

      <select value={rule.operator} className='p-1.5 rounded bg-[#F8F8FB]' onChange={updateOperator}>
        {availableOperators.map((operator) => (
          <option key={operator} value={operator}>{operatorToTextMap[operator]}</option>
        ))}
      </select>

      <input type={operatorType} className='p-1.5 rounded bg-[#F8F8FB] w-fit' value={rule.value as any} onChange={(ev) => updateValue(ev, operatorType)} />

      <button className='p-1.5 border border-transparent hover:border-gray-200 hover:rounded hover:bg-gray-50' onClick={closeRule} >
        <CloseIcon className='w-4 h-4 fill-gray-600' />
      </button>
    </div>
  </div>);
}