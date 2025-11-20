export default function Input({
  label,
  value,
  onChange,
  error,
  errorMessage,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="input">{label}</label>
      <input
        value={value}
        placeholder="입력"
        className={`h-14.5 px-5 py-4 border  rounded-md ${error ? 'border-red-40' : 'border-gray-30'}`}
        onChange={onChange}
      />
      <p>{error ? errorMessage : ''}</p>
    </div>
  );
}
