import { Button } from "./Button";
import { Selector } from "./Selector";

export interface HeaderProps {
  condition: string;
  onConditionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  addRule: (event: React.MouseEvent<HTMLButtonElement>) => void;
  addGroup: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ condition, onConditionChange, addRule, addGroup }) => {
  const options = [{ label: 'AND', value: 'and' }, { label: 'OR', value: 'or' }];

  return <div className="flex space-x-1">
    <Selector onChange={onConditionChange} options={options} value={condition} />
    <Button onClick={addRule}>+ Rule</Button>
    <Button disabled onClick={addGroup} >+ Group</Button>
  </div>
}