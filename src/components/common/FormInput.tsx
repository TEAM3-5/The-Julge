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
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const fieldError = errors[name] as FieldError | undefined;

        return (
          <Input
            id={name}
            label={label}
            unit={unit}
            error={!!fieldError}
            errorMessage={fieldError?.message}
            {...field} // value, onChange, onBlur 자동 전달
            {...restInputProps} // type, placeholder 등등..
          />
        );
      }}
    />
  );
}
