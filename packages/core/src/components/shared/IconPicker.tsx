//packages/core/src/components/shared/IconPicker.tsx
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CATEGORY_ICONS,
  type CategoryIconName,
} from "../../icons/categoryIcons";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const SelectedIcon =
    CATEGORY_ICONS[value as CategoryIconName] || CATEGORY_ICONS.Globe;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
          />
        }
      >
        <SelectedIcon className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          {Object.entries(CATEGORY_ICONS).map(([name, IconComponent]) => (
            <Button
              key={name}
              variant={value === name ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => onChange(name)}
              title={name}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
