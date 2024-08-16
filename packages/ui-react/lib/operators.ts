export const typeToOperatorsMap: { [key: string]: string[] } = {  
  'string': ['eq', 'ne'],  
  'number': ['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'between'],
  'date': ['eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'between'],
  'boolean': ['eq'],
  'enum': ['eq', 'ne'],
};

export const operatorToTextMap: { [key: string]: string } = {
  'eq': 'is',
  'ne': 'is not',
  'lt': '<',
  'lte': '<=',
  'gt': '>',
  'gte': '>=',
  'between': 'between',
};