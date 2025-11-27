'use client';

import { useFormContext, FieldError, Path, FieldValues } from 'react-hook-form';
import { ComponentPropsWithoutRef } from 'react';
import Textarea from './Textarea';

type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
} & Omit<ComponentPropsWithoutRef<'textarea'>, 'name' | 'id'>;

export default function FormTextarea<T extends FieldValues>({
  name,
  label,
  ...restTextareaProps
}: FormTextareaProps<T>) {
  const {
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext<T>();

  const fieldError = errors[name] as FieldError | undefined;

  const registerResult = register(name, {
    onChange: () => {
      if (fieldError) {
        clearErrors(name);
      }
    },
  });

  return (
    <Textarea
      id={name}
      label={label}
      error={!!fieldError}
      errorMessage={fieldError?.message}
      {...registerResult}
      {...restTextareaProps}
    />
  );
}
