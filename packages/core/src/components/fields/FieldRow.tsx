//packages/core/src/components/fields/FieldRow.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CopyButton } from "../shared/CopyButton";
import type { ItemField, FieldType } from "../../types/field";
import { ReactNode } from "react";

interface FieldRowProps {
  field: ItemField;
  onUpdateLabel: (id: string, label: string) => void;
  onUpdateType: (id: string, type: FieldType) => void;
  onRemove: (id: string) => void;
  children: ReactNode;
}

export function FieldRow({
  field,
  onUpdateLabel,
  onUpdateType,
  onRemove,
  children,
}: FieldRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: field.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card flex flex-col items-start gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab p-1"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex w-full gap-2 sm:w-1/3">
        <Input
          value={field.label}
          onChange={(e) => onUpdateLabel(field.id, e.target.value)}
          placeholder="Label"
          className="w-1/2"
        />
        <Select
          value={field.type}
          onValueChange={(val) => onUpdateType(field.id, val as string as FieldType)}
        >
          <SelectTrigger className="w-1/2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="textarea">Notes</SelectItem>
            <SelectItem value="label">Label</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex-1">{children}</div>

      <div className="flex items-center gap-1">
        {field.type !== "label" && <CopyButton value={field.value} />}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(field.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
