//packages/core/src/components/fields/TextareaField.tsx
import { useState, useMemo } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import type { SimpleFieldProps } from "./TextField";
import { marked } from "marked";
import DOMPurify from "dompurify";

export function TextareaField({ field, onChange, readOnly }: SimpleFieldProps) {
  const [preview, setPreview] = useState(false);

  const htmlContent = useMemo(() => {
    if (!preview) return "";
    try {
      const rawMarkup = marked.parse(field.value) as string;
      return DOMPurify.sanitize(rawMarkup);
    } catch {
      return "Error parsing markdown";
    }
  }, [field.value, preview]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Edit" : "Preview Markdown"}
        </Button>
      </div>
      {preview ? (
        <div
          className="prose prose-sm dark:prose-invert max-w-none p-3 border rounded-md min-h-20 bg-muted/50"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <Textarea
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={field.label}
          className="min-h-20 w-full"
        />
      )}
    </div>
  );
}
