import Link from 'next/link';
import { ComponentPropsWithRef, forwardRef } from 'react';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className'>;
type OutlineButtonColor = 'primary' | 'blue' | 'gray';

const outlineColors: Record<OutlineButtonColor, string> = {
  primary: 'border-primary text-primary',
  blue: 'border-blue-20 text-blue-20',
  gray: 'border-gray-40 text-gray-600',
};
type CustomButtonProps = {
  variant?: 'primary' | 'outline' | 'gray';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string; // 추가로 스타일 더 줄 수 있게
  btnColor?: OutlineButtonColor;
  href?: string; // 링크로 사용할 때
};

const sizeStyles = {
  small: 'px-[12px] py-[8px] tj-caption',
  medium: 'px-[20px] py-[10px] tj-body2-bold',
  large: 'md:w-full md:max-w-[312px] py-3.5 tj-body1-bold',
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
      href,
      children,
      ...rest
    },
    ref,
  ) => {
    // 공통 베이스 스타일
    const baseClass =
      'inline-flex items-center justify-center rounded-md disabled:cursor-not-allowed disabled:bg-gray-40 disabled:text-white disabled:border-gray-40';

    // variant에 따라 색 결정
    const outlineBaseClass = `bg-white border ${outlineColors[btnColor] ?? outlineColors.primary}`;
    const variantClass =
      variant === 'outline'
        ? outlineBaseClass
        : variant === 'gray'
          ? 'bg-gray-50 text-white'
          : 'bg-primary text-white';

    const sizeClass = sizeStyles[size];

    // className에 'w-'로 시작하는 속성이 있으면 w-fit 제거
    const hasCustomWidth = className?.split(/\s+/).some((cls) => cls.startsWith('w-')) ?? false;
    // fullWidth 여부
    const widthClass = fullWidth ? 'w-full' : hasCustomWidth ? '' : 'w-fit';

    const mergedClassName = [baseClass, variantClass, sizeClass, widthClass, className]
      .filter(Boolean)
      .join(' ');

    const content = isLoading ? '로딩 중...' : children;

    if (href && !disabled && !isLoading) {
      return (
        <Link href={href} className={mergedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={mergedClassName}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
