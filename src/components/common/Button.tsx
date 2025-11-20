import { ReactNode } from 'react';

type ButtonSize = 'large' | 'medium' | 'small';
type OutlineButtonColor = 'primary' | 'blue';

const sizeStyles: Record<ButtonSize, string> = {
  large: 'w-fit px-[136px] py-3.5 tj-body1-bold rounded-md',
  medium: 'w-fit px-[20px] py-[10px] tj-body2-bold rounded-md',
  small: 'w-fit px-[12px] py-[8px] tj-caption rounded-md',
};
const outlineColors: Record<OutlineButtonColor, string> = {
  primary: 'border-primary text-primary',
  blue: 'border-blue-20 text-blue-20',
};

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline';
  btnColor?: OutlineButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

  type = 'button',
  variant = 'primary',
  btnColor = 'primary',
  size = 'large',
  disabled,
  children,
  onClick,
}: ButtonProps) {
  const primaryStyle = 'bg-primary text-white ';
  const disabledStyle = 'bg-gray-40 text-white cursor-not-allowed';
  const outlineStyle = `bg-white border ${outlineColors[btnColor]}`;

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
