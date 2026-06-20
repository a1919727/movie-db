import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectorOption = {
  label: string;
  value: string;
};

type MovieSelectorProps = {
  placeholder: string;
  options: SelectorOption[];
  value?: string;
  onValueChange?: (value: string) => void;
};

export function MovieSelector({
  options,
  value,
  placeholder,
  onValueChange,
}: MovieSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="start" position="popper">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
