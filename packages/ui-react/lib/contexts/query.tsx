import { QueryBuilder } from "@yaqb/core";
import React from "react";

export type QueryContextProps = {
  queryBuilder: QueryBuilder;
  setQueryBuilder: (queryBuilder: QueryBuilder) => void;
};

const initialQueryContext: QueryContextProps = {
  queryBuilder: new QueryBuilder({ condition: 'and', rules: [] }, []),
  setQueryBuilder: () => {},
};

export const QueryContext = React.createContext<QueryContextProps>(initialQueryContext);

export type QueryProviderProps = {
  children: React.ReactNode;
  queryBuilder: QueryBuilder;
  setQueryBuilder: (queryBuilder: QueryBuilder) => void;
};

export const QueryProvider: React.FC<QueryProviderProps> = ({ children, queryBuilder, setQueryBuilder }) => {
  return (
    <QueryContext.Provider value={{ queryBuilder, setQueryBuilder }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQuery = (): QueryContextProps => {
  return React.useContext(QueryContext);
};