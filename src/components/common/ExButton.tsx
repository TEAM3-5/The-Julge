import { forwardRef, type ComponentPropsWithRef } from 'react';

type ButtonSize = 'large' | 'medium' | 'small';
type OutlineButtonColor = 'primary' | 'blue';

const sizeStyles: Record<ButtonSize, string> = {
  large: 'px-[136px] py-3.5 tj-body1-bold rounded-md',
  medium: 'px-[20px] py-[10px] tj-body2-bold rounded-md',
  small: 'px-[12px] py-[8px] tj-caption rounded-md',
};
const outlineColors: Record<OutlineButtonColor, string> = {
  primary: 'border-primary text-primary',
  blue: 'border-blue-20 text-blue-20',
};

type ButtonProps = {
  variant?: 'primary' | 'outline';
  btnColor?: OutlineButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
} & ComponentPropsWithRef<'button'>;

// const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   ({type='button', variant=}) => {

//   }
// )

export default function Button({
  type = 'button',
  variant = 'primary',
  btnColor = 'primary',
  size = 'large',
  disabled,
  children,
  className,
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const primaryStyle = 'bg-primary text-white ';
  const disabledStyle = 'bg-gray-40 text-white cursor-not-allowed';
  const outlineStyle = `bg-white border ${outlineColors[btnColor]}`;

  const variantStyle = disabled
    ? disabledStyle
    : variant === 'outline'
      ? outlineStyle
      : primaryStyle;

  // className에 'w-'로 시작하는 속성 있으면 w-fit 속성 제거
  const hasCustomWidth = className?.split(' ').some((cls) => cls.startsWith('w-')) ?? false;

  const btnWidth = fullWidth ? 'w-full' : hasCustomWidth ? '' : 'w-fit';
  const btnStyle = `${btnWidth} ${sizeStyles[size]} ${variantStyle} ${className ?? ''}`;

  return (
    <button type={type} disabled={disabled} className={btnStyle} {...rest}>
      {children}
    </button>
  );
}
