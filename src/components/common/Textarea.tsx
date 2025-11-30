import { ComponentPropsWithRef, forwardRef } from 'react';

type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  id?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, errorMessage, ...restTextareaProps }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && id && <label htmlFor={id}>{label}</label>}

        <div className={`rounded-md bg-white border ${error ? 'border-red-40' : 'border-gray-30'}`}>
          <textarea
            id={id}
            ref={ref}
            className="w-full min-h-[180px] px-5 py-4 text-tj-body1 resize-none focus:outline-none"
            {...restTextareaProps}
          />
        </div>

        {error && errorMessage && (
          <p className="ml-2 text-red-40 text-tj-caption">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
