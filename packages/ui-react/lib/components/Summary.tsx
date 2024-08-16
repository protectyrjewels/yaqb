import { useEffect, useState } from "react";
import { useQuery } from "../contexts/query";

export interface SummaryProps {
  title: string;
}

export const Summary: React.FC<SummaryProps> = ({ title }) => {
  const { queryBuilder } = useQuery();
  const [sentence, setSentence] = useState<string | null>(null);

  useEffect(() => {
    const sentence = queryBuilder.toSentence();
    console.log('sentence', sentence);
    setSentence(sentence);
  }, [queryBuilder]);

  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className='mt-2 rounded-md border border-gray-200 bg-gray-100 text-sm break-words max-w-[400px]'>
        <div className='p-2'>{sentence ? `Users ${sentence}` : 'No statement yet'}</div>
      </div>
    </div>
  )
}