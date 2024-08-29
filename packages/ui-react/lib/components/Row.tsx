import type { Rule, Field } from '@yaqb/core';
import { useEffect, useState } from 'react';
import { operatorToTextMap, typeToOperatorsMap } from '../operators';
import CloseIcon from '../icons/close';
import { useQuery } from '../contexts/query';
import { Labelled, PrimitiveType } from '@yaqb/core/src/fields';

export interface CustomRuleProps {
  title: string;
  rule: Rule;
  fields: Field[];
  ruleIndex: number;

  closeRule: () => void;
}

function isLabelledType(obj: PrimitiveType | Labelled<PrimitiveType>): obj is Labelled<PrimitiveType> {
  return (obj as Labelled<PrimitiveType>).label !== undefined && (obj as Labelled<PrimitiveType>).value !== undefined;
}

const Input: React.FC<{ rule: Rule, fields: Field[], updateValue: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, type: string, pos: number) => void }> = ({ rule, fields, updateValue }) => {
  const [vals, setVals] = useState<Array<PrimitiveType | Labelled<PrimitiveType>>>(rule.value);

  const field = fields.find((field) => field.field === rule.field);
  if (!field) {
    throw new Error(`Field ${rule.field} not found`);
  }

  useEffect(() => {
    async function getVals() {
      if (!field) return
      console.log(field)
      if (field.value instanceof Function) {
        console.log('field.value is a function')
        const values = await field.value();
        setVals(values);
      } else if (Array.isArray(field.value)) {
        setVals(field.value);
      }
    }
    getVals();
 }, [field]);

  
  if (rule.operator === 'between') {
    return (
      <div className='flex space-x-2 items-center'>
        <input type={field.type} className='p-1.5 rounded bg-[#F8F8FB] w-14' value={vals[0] as PrimitiveType} onChange={(e) => updateValue(e, 'number', 0)} />
        <span className='text-gray-600'>and</span>
        <input type={field.type} className='p-1.5 rounded bg-[#F8F8FB] w-14' value={vals[1] as PrimitiveType} onChange={(e) => updateValue(e, 'number', 1)} />
      </div>
    );
  }

  switch (field.type) {
    case 'enum':
      return (
        <select className='p-1.5 rounded bg-[#F8F8FB] w-fit' value={(rule.value as any)[0]} onChange={(e) => updateValue(e, 'text', 0)}>
          {(vals).map((opt) => {
            if (isLabelledType(opt)) {
              return <option key={opt.value} value={opt.value}>{opt.label}</option>
            }  
          })}
        </select>
      );
    default:
      return <input type={field.type} className='p-1.5 rounded bg-[#F8F8FB] w-fit' value={vals[0] as any} onChange={(e) => updateValue(e, 'text', 0)} />
  }
}

export const Row: React.FC<CustomRuleProps> = ({ title, ruleIndex, rule: initialRule, fields, closeRule }) => {
  const { queryBuilder, setQueryBuilder } = useQuery();
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);
  const [rule, setRule] = useState<Rule>(initialRule);
  
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

  const updateValue = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, type: string, pos: number) => {
    const val = rule.value;
    if (type === 'number') {
      val.splice(pos, 1, e.target.value);
      setRule({ ...rule, value: val });
    } else {
      val.splice(pos, 1, e.target.value);
      setRule({ ...rule, value: val });
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

      <Input rule={rule} fields={fields} updateValue={updateValue} />

      <button className='p-1.5 border border-transparent hover:border-gray-200 hover:rounded hover:bg-gray-50' onClick={closeRule} >
        <CloseIcon className='w-4 h-4 fill-gray-600' />
      </button>
    </div>
  </div>);
}