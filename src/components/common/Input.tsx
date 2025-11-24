import { ComponentPropsWithRef } from 'react';

type InputProps = ComponentPropsWithRef<'input'> & {
  id: string; // label과 input을 연결하기 위해 필수 prop으로 다시 선언했습니다.
  label: string;
  unit?: string;
  error?: boolean;
  errorMessage?: string;
};

export default function Input({
  id,
  label,
  unit,
  error,
  errorMessage,
  ...restInputProps
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <div
        className={`flex items-center h-14.5 px-5 py-4 rounded-md bg-white border ${error ? 'border-red-40' : 'border-gray-30'} `}
      >
        <input
          id={id}
          className={`flex-1 focus:outline-none appearance-none`}
          {...restInputProps}
        />
        {unit && <span className="text-tj-body1 select-none">{unit}</span>}
      </div>
      {error && <p className="ml-2 text-red-40 text-tj-caption">{errorMessage}</p>}
    </div>
  );
}
