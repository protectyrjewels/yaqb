import type { Field, Rule, RuleElem, RuleGroup as RuleGroupType } from '@yaqb/core';
import { QueryBuilder } from '@yaqb/core';
import { MongoQB } from '@yaqb/mongo';
import { PostgresQB } from '@yaqb/pg';
import { useState } from 'react';
import { QueryProvider } from '../contexts/query';
import { Query } from './Query';
import { CustomRule } from './CustomRule';
import { Summary } from './Summary';
import { Dropdown } from './Dropdown';
import { typeToOperatorsMap } from '../operators';
import { capitalize } from '../utils';

QueryBuilder.registerDialect(new MongoQB());
QueryBuilder.registerDialect(new PostgresQB());

const segments = [
  { label: 'Demographic', value: 'demographic' },
  { label: 'Geographic', value: 'geographic' },
  // { label: 'Behavioral', value: 'behavioral', disabled: true },
];

export interface BuilderProps {
  rules: RuleGroupType;
  fields: Field[];
}

export const Builder: React.FC<BuilderProps> = ({ rules, fields }) => {
  const [queryBuilder, setQueryBuilder] = useState(new QueryBuilder(rules, fields));

  const addRule = (segment: string) => {
    const segmentField = fields.find(field => field.metadata?.category === segment);
    if (!segmentField) return;
    const op = typeToOperatorsMap[segmentField.type][0];
    const newRule = { field: segmentField.field, operator: op, value: '' };
    setQueryBuilder(queryBuilder.withNewRule(newRule));
  };

  const removeRule = (index: number) => {
    setQueryBuilder(queryBuilder.withoutRule(index));
  };

  return (
    <QueryProvider queryBuilder={queryBuilder} setQueryBuilder={setQueryBuilder} >
      <div className='flex space-x-6 w-full'>
        <div className='flex flex-col space-y-2'>
          <div className="flex items-center justify-between">
            <div className='text-sm font-semibold'>Rules:</div>

            <Dropdown title="+ Add rule" options={segments} onClick={addRule}/>
          </div>

          <div className='flex flex-col space-y-4 h-fit'>
            {queryBuilder.rules.rules.map((rule: RuleElem, index: number) => (
              ('field' in rule) ?
                <CustomRule
                  key={index}
                  title={capitalize(fields.find(field => field.field === rule.field)?.metadata?.category)}
                  ruleIndex={index}
                  rule={rule as Rule}
                  fields={fields.filter(field => field.metadata?.category === fields.find(field => field.field === rule.field)?.metadata?.category)}
                  closeRule={() => removeRule(index)} /> :
                'Unsupported'
            ))}
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <Summary title='Overview:' />
          <Query title='Query:' />
        </div>
      </div>
    </QueryProvider>
  );
};