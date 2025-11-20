interface InputProps {
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}

export default function Input({
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="input">{label}</label>
      <input
        type={type}
        value={value}
        placeholder="입력"
        className={`h-14.5 px-5 py-4 bg-white border rounded-md ${error ? 'border-red-40' : 'border-gray-30'}`}
        onChange={onChange}
        onBlur={onBlur}
      />
      <p className="ml-2 text-red-40 text-tj-caption">{error ? errorMessage : ''}</p>
    </div>
  );
}
