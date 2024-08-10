export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({ children, className, onClick, disabled }) => {
  return (
    <button disabled={disabled} onClick={onClick} className={`py-1.5 px-2 rounded-md bg-zinc-300 disabled:bg-zinc-400 disabled:cursor-not-allowed ${className}`}>
      {children}
  </button>);
}