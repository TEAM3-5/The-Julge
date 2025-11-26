export type MemberTypeValue = 'member' | 'owner';

type MemberTypeOption = {
  id: string;
  value: MemberTypeValue;
  label: string;
};

const MEMBER_TYPE_OPTIONS: MemberTypeOption[] = [
  { id: 'member', value: 'member', label: '알바님' },
  { id: 'owner', value: 'owner', label: '사장님' },
] as const;

interface MemberTypeRadioBtnProps {
  selectedValue: MemberTypeValue | null;
  onChange: (value: MemberTypeValue) => void;
}

export default function MemberTypeRadioBtn({ selectedValue, onChange }: MemberTypeRadioBtnProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="tj-body1">회원 유형</p>
      <div role="radiogroup" className="flex items-center gap-4">
        {MEMBER_TYPE_OPTIONS.map((option) => (
          <div key={option.id}>
            <label
              htmlFor={option.id}
              className="flex items-center gap-[9px] px-[41px] py-[13px] rounded-full bg-white border border-gray-30 cursor-pointer has-[:checked]:border-primary"
            >
              <input
                type="radio"
                id={option.id}
                name="member-type"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => onChange(option.value)}
                className="peer hidden"
              />
              <span className="h-5 w-5 rounded-full border border-gray-30 bg-white peer-checked:border-primary peer-checked:bg-[url('/images/ModalAction.svg')] peer-checked:bg-center peer-checked:bg-no-repeat" />
              <span className="select-none">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
