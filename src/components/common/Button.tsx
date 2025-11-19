import { ReactNode } from 'react';

type ButtonSize = 'large' | 'medium' | 'small';

const sizeStyles: Record<ButtonSize, string> = {
  large: 'px-[136px] py-3.5 tj-body1-bold',
  medium: 'px-[20px] py-[10px] tj-body2-bold',
  small: 'px-[12px] py-[8px] tj-caption',
};

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'large',
  disabled,
  children,
  onClick,
}: {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline';
  size?: ButtonSize;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  const primaryStyle = 'w-fit bg-primary text-white  rounded-md';
  const disabledStyle = 'w-fit bg-gray-40 text-white rounded-md cursor-not-allowed';
  const outlineStyle = 'w-fit bg-white border border-primary text-primary rounded-md';

  const variantStyle = disabled
    ? disabledStyle
    : variant === 'outline'
      ? outlineStyle
      : primaryStyle;
  const btnStyle = `${sizeStyles[size]} ${variantStyle}`;

  return (
    <button type={type} disabled={disabled} className={btnStyle} onClick={onClick}>
      {children}
    </button>
  );
}
