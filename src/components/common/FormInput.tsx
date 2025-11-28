'use client';

import { extractDigits, formatPhoneNumber } from '@/utils/phone';
import { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { useFormContext, FieldError, Path, FieldValues } from 'react-hook-form';
import Input from './Input';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>; // RHF에서 필드 이름 (ex: "email", "password")
  label?: string;
  unit?: string;
  numericOnly?: boolean;
} & Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'id'>;

export default function FormInput<T extends FieldValues>({
  name,
  label,
  unit,
  numericOnly,
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
    onChange: (e) => {
      const inputEvent = e as ChangeEvent<HTMLInputElement>;

      if (numericOnly) {
        // 숫자만 남기기 + 길이 제한
        const digits = extractDigits(inputEvent.target.value);

        // 하이픈 포맷 적용
        inputEvent.target.value = formatPhoneNumber(digits);
      }

      if (fieldError) clearErrors(name);
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
