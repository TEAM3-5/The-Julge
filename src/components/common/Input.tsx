interface InputProps {
  type?: string;
  label: string;
  value: string;
  showUnit?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}

export default function Input({
  type = 'text',
  label,
  value,
  showUnit = false,
  onChange,
  onBlur,
  error,
  errorMessage,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="input">{label}</label>
      <div
        className={`flex items-center h-14.5 px-5 py-4 bg-white border ${error ? 'border-red-40' : 'border-gray-30'} rounded-md`}
      >
        <input
          type={type}
          value={value}
          placeholder="입력"
          className={`flex-1 focus:outline-none appearance-none`}
          onChange={onChange}
          onBlur={onBlur}
        />
        {showUnit && <span className="text-tj-body1 select-none">원</span>}
      </div>
      {error && <p className="ml-2 text-red-40 text-tj-caption">{errorMessage}</p>}
    </div>
  );
}
