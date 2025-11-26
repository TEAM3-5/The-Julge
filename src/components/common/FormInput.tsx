'use client';

import { useFormContext, FieldError, Path, FieldValues } from 'react-hook-form';
import Input from './Input';
import { ComponentPropsWithoutRef } from 'react';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>; // RHF에서 필드 이름 (ex: "email", "password")
  label?: string;
  unit?: string;
} & Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'id'>;

export default function FormInput<T extends FieldValues>({
  name,
  label,
  unit,
  ...restInputProps
}: FormInputProps<T>) {
  const {
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext<T>();

  const fieldError = errors[name] as FieldError | undefined;

  // register 기반으로 RHF와 연결 (언컨트롤드 input)
  const registerResult = register(name, {
    onChange: (_event) => {
      // 이 필드에 에러가 있는 상태에서 타이핑을 시작하면 에러 제거
      if (fieldError) {
        clearErrors(name);
      }
      // RHF의 onChange는 register 내부에서 이미 처리됨
    },
  });

  return (
    <Input
      id={name}
      label={label}
      unit={unit}
      error={!!fieldError}
      errorMessage={fieldError?.message}
      {...registerResult} // name, onChange, onBlur, ref 등 RHF에서 제공
      {...restInputProps} // type, placeholder 등 추가 props
    />
  );
}
