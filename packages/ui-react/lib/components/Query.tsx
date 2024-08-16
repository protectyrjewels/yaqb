import { useEffect, useState } from "react";
import { useQuery } from "../contexts/query";

export interface QueryProps {
  title: string;
}

export const Query: React.FC<QueryProps> = ({ title }) => {
  const { queryBuilder } = useQuery();

  const [format, setFormat] = useState<string>('json');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (format === 'json') {
      setQuery(JSON.stringify(queryBuilder.rules, null, 2));
    } else if (format === 'sql') {
      const q = queryBuilder.toQuery('pg');
      setQuery(q);
    } else if (format === 'mongo') {
      const q = queryBuilder.toQuery('mongo');
      setQuery(JSON.stringify(q, null, 2));
    }
  }, [format, queryBuilder]);

  return (
    <div className='text-sm'>
      <div className='text-sm font-semibold'>{title}</div>
      <select className='mt-2 p-1.5 w-fit border border-gray-200 rounded-md bg-gray-100' value={format} onChange={(event) => { setFormat(event.target.value) }}>
        <option value='json'>UQL</option>
        <option value='mongo'>MongoDB</option>
        <option value='sql'>SQL</option>
      </select>
      <div className='mt-2 border border-gray-200 rounded-md bg-gray-100 break-words max-w-[400px]'>
        <div className='p-2'>{query}</div>
      </div>
    </div>
  )
}
