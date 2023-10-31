export type ButtonType = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};
