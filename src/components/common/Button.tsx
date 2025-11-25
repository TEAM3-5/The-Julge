import Link from 'next/link';
import { ComponentPropsWithRef, forwardRef } from 'react';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className'>;
type OutlineButtonColor = 'primary' | 'blue';

const outlineColors: Record<OutlineButtonColor, string> = {
  primary: 'border-primary text-primary',
  blue: 'border-blue-20 text-blue-20',
};
type CustomButtonProps = {
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string; // 추가로 스타일 더 줄 수 있게
  btnColor?: OutlineButtonColor;
  href?: string;
  target?: ComponentPropsWithRef<'a'>['target'];
  rel?: ComponentPropsWithRef<'a'>['rel'];
};

const sizeStyles = {
  small: 'px-[12px] py-[8px] tj-caption',
  medium: 'px-[20px] py-[10px] tj-body2-bold',
  large: 'px-[136px] py-3.5 tj-body1-bold',
} as const;

export type ButtonProps = CustomButtonProps & NativeButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'large',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      btnColor = 'primary',
      children,
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    // 공통 베이스 스타일
    const baseClass =
      'inline-flex items-center justify-center rounded-md disabled:cursor-not-allowed disabled:bg-gray-40 disabled:text-white disabled:border-gray-40';

    // variant에 따라 색 결정
    const outlineBaseClass = `bg-white border ${outlineColors[btnColor] ?? outlineColors.primary}`;
    const variantClass = variant === 'outline' ? outlineBaseClass : 'bg-primary text-white';

    const sizeClass = sizeStyles[size];

    // className에 'w-'로 시작하는 속성이 있으면 w-fit 제거
    const hasCustomWidth = className?.split(/\s+/).some((cls) => cls.startsWith('w-')) ?? false;
    // fullWidth 여부
    const widthClass = fullWidth ? 'w-full' : hasCustomWidth ? '' : 'w-fit';

    const mergedClassName = [baseClass, variantClass, sizeClass, widthClass, className]
      .filter(Boolean)
      .join(' ');

    if (href) {
      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={`${mergedClassName} ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          {isLoading ? '로딩 중...' : children}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} disabled={isDisabled} className={mergedClassName} {...rest}>
        {isLoading ? '로딩 중...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
