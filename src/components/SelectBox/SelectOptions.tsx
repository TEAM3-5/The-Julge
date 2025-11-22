import { cn } from "@/utils";
import { Option } from "@/types/global";

type STYLES = { boxSelect: string; fontSelect: string };

interface OptionProps {
  isOpen: boolean;
  options: Option[];
  onSelect: (option: Option) => void;
  style: STYLES;
  className?: string;
}

const SelectOptions = ({ isOpen, options, onSelect, style, className }: OptionProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "custom-scroll absolute left-0 right-0 z-40 mt-8 overflow-y-auto bg-white rounded-md border border-gray-30 shadow-md",
        className
      )}
    >
      {options.map((option, index) => (
        <div
          key={option.value || index}
          className={cn(
            "border-b border-solid border-gray-20 py-12 text-center text-black last:border-none hover:bg-gray-100 cursor-pointer"
          )}
          onClick={() => onSelect(option)}
          aria-label="셀렉트박스 옵션"
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default SelectOptions;
