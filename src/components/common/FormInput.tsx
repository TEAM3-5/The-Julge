'use client';

import { useFormContext, Controller, FieldError, Path, FieldValues } from 'react-hook-form';
import Input from './Input';
import { ComponentPropsWithoutRef } from 'react';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>; // RHF에서 필드 이름 (ex: "email", "password")
  label: string;
  unit?: string;
} & ComponentPropsWithoutRef<'input'>;

export default function FormInput<T extends FieldValues>({
  name,
  label,
  unit,
  ...restInputProps
}: FormInputProps<T>) {
  const {
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const fieldError = errors[name] as FieldError | undefined;

        // ✅ onChange를 한 번 감싸서, 타이핑 시작하면 에러를 지워줌
        const handleChange: typeof field.onChange = (event) => {
          if (fieldError) {
            clearErrors(name); // 이 필드의 에러만 지움
          }
          field.onChange(event); // 원래 RHF onChange 호출
        };

        return (
          <Input
            id={name}
            label={label}
            unit={unit}
            error={!!fieldError}
            errorMessage={fieldError?.message}
            {...field} // value, onChange, onBlur 자동 전달
            value={field.value ?? ''} // 시급에서 placeholder 표시를 위해 undefined 사용해야해서..
            onChange={handleChange}
            {...restInputProps} // type, placeholder 등등..
          />
        );
      }}
    />
  );
}
