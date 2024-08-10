export interface SelectorProps {
  value?: string;
  options: { label: string, value: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Selector: React.FC<SelectorProps> = ({ value, options, onChange }) => {
  return (<select className="py-1.5 px-2 rounded-md bg-zinc-300" value={value} onChange={onChange}>
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>);
}