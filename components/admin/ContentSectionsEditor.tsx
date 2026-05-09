"use client";

import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { convertToWebp } from "@/lib/convertToWebp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Trash2,
  Upload,
  X,
  Type,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  HelpCircle,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Columns2,
  Columns3,
} from "lucide-react";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const paragraphSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().min(1, "Cannot be empty"),
});
const imageSchema = z.object({
  type: z.literal("image"),
  src: z.string().min(1, "Image required"),
  alt: z.string().optional(),
  caption: z.string().optional(),
});
const blockquoteSchema = z.object({
  type: z.literal("blockquote"),
  text: z.string().min(1, "Cannot be empty"),
  cite: z.string().optional(),
});
const listSchema = z.object({
  type: z.literal("list"),
  style: z.enum(["bullet", "number", "letter"]),
  items: z.array(z.string().min(1, "Item cannot be empty")).min(1),
});
const faqSchema = z.object({
  type: z.literal("faq"),
  items: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .min(1),
});
const mediaCardsSchema = z.object({
  type: z.literal("media-cards"),
  layout: z.enum(["row", "grid", "stack"]),
  items: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
        title: z.string().min(1, "Title required"),
        description: z.string().min(1, "Description required"),
      })
    )
    .min(1),
});
const comparisonSchema = z.object({
  type: z.literal("comparison"),
  leftLabel: z.string().min(1, "Left label required"),
  rightLabel: z.string().min(1, "Right label required"),
  rows: z
    .array(
      z.object({
        feature: z.string().min(1, "Feature required"),
        left: z.string().min(1, "Value required"),
        right: z.string().min(1, "Value required"),
      })
    )
    .min(1),
});

export const leafBlockSchema = z.discriminatedUnion("type", [
  paragraphSchema,
  imageSchema,
  blockquoteSchema,
  listSchema,
  faqSchema,
  mediaCardsSchema,
  comparisonSchema,
]);

const columnsSchema = z.object({
  type: z.literal("columns"),
  columns: z
    .array(
      z.object({
        blocks: z
          .array(leafBlockSchema)
          .min(1, "Each column needs at least one block"),
      })
    )
    .min(2, "At least 2 columns required")
    .max(4, "Maximum 4 columns"),
});

export const blockSchema = z.discriminatedUnion("type", [
  paragraphSchema,
  imageSchema,
  blockquoteSchema,
  listSchema,
  faqSchema,
  mediaCardsSchema,
  comparisonSchema,
  columnsSchema,
]);

export const sectionSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  blocks: z.array(blockSchema).min(1, "At least one block is required"),
});

export type LeafBlockData = z.infer<typeof leafBlockSchema>;
export type BlockData = z.infer<typeof blockSchema>;
export type SectionData = z.infer<typeof sectionSchema>;

// ─── Add Block Dropdown ───────────────────────────────────────────────────────

function AddBlockDropdown({
  onAdd,
  showColumns = true,
}: {
  onAdd: (block: BlockData) => void;
  showColumns?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => onAdd({ type: "paragraph", text: "" })}
        >
          <Type className="w-4 h-4 mr-2" /> Paragraph
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onAdd({ type: "image", src: "", alt: "", caption: "" })
          }
        >
          <ImageIcon className="w-4 h-4 mr-2" /> Image
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd({ type: "blockquote", text: "", cite: "" })}
        >
          <Quote className="w-4 h-4 mr-2" /> Blockquote
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd({ type: "list", style: "bullet", items: [""] })}
        >
          <List className="w-4 h-4 mr-2" /> Bullet List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd({ type: "list", style: "number", items: [""] })}
        >
          <ListOrdered className="w-4 h-4 mr-2" /> Numbered List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAdd({ type: "list", style: "letter", items: [""] })}
        >
          <ListOrdered className="w-4 h-4 mr-2" /> Letter List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onAdd({ type: "faq", items: [{ question: "", answer: "" }] })
          }
        >
          <HelpCircle className="w-4 h-4 mr-2" /> FAQ
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onAdd({
              type: "media-cards",
              layout: "grid",
              items: [{ src: "", alt: "", title: "", description: "" }],
            })
          }
        >
          <LayoutGrid className="w-4 h-4 mr-2" /> Media Cards
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onAdd({
              type: "comparison",
              leftLabel: "",
              rightLabel: "",
              rows: [{ feature: "", left: "", right: "" }],
            })
          }
        >
          <Columns2 className="w-4 h-4 mr-2" /> Comparison
        </DropdownMenuItem>
        {showColumns && (
          <DropdownMenuItem
            onClick={() =>
              onAdd({
                type: "columns",
                columns: [
                  { blocks: [{ type: "paragraph", text: "" }] },
                  { blocks: [{ type: "paragraph", text: "" }] },
                ],
              })
            }
          >
            <Columns3 className="w-4 h-4 mr-2" /> Columns
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── List Block Editor ────────────────────────────────────────────────────────

function ListBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const items = (useWatch({
    control,
    name: `${prefix}.items`,
  }) as string[]) || [""];
  const addItem = () => setValue(`${prefix}.items`, [...items, ""]);
  const removeItem = (index: number) =>
    setValue(
      `${prefix}.items`,
      items.filter((_, i) => i !== index)
    );

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-xs text-muted-foreground mt-2.5 w-5 text-right flex-shrink-0">
            {i + 1}.
          </span>
          <Input
            {...register(`${prefix}.items.${i}`)}
            placeholder={`Item ${i + 1}`}
            className="flex-1 text-sm"
          />
          {items.length > 1 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeItem(i)}
              className="flex-shrink-0"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Item
      </Button>
    </div>
  );
}

// ─── FAQ Block Editor ─────────────────────────────────────────────────────────

function FaqBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const items = (useWatch({ control, name: `${prefix}.items` }) as {
    question: string;
    answer: string;
  }[]) || [{ question: "", answer: "" }];
  const addItem = () =>
    setValue(`${prefix}.items`, [...items, { question: "", answer: "" }]);
  const removeItem = (index: number) =>
    setValue(
      `${prefix}.items`,
      items.filter((_, i) => i !== index)
    );

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-lg p-3 space-y-2 bg-secondary/30"
        >
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-primary mt-2 flex-shrink-0">
              Q{i + 1}
            </span>
            <Input
              {...register(`${prefix}.items.${i}.question`)}
              placeholder="Question"
              className="flex-1 text-sm font-medium"
            />
            {items.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeItem(i)}
                className="flex-shrink-0"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-muted-foreground mt-2 flex-shrink-0">
              A{i + 1}
            </span>
            <Textarea
              {...register(`${prefix}.items.${i}.answer`)}
              placeholder="Answer"
              rows={2}
              className="flex-1 text-sm resize-none"
            />
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add FAQ Item
      </Button>
    </div>
  );
}

// ─── Media Cards Block Editor ─────────────────────────────────────────────────

function MediaCardsItemEditor({
  prefix,
  control,
  register,
  setValue,
  index,
  onRemove,
  canRemove,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const src = useWatch({ control, name: `${prefix}.src` }) as string;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("content-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("content-images").getPublicUrl(path);
      setValue(`${prefix}.src`, data.publicUrl);
    } catch {
      // silent — user can retry
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="border border-border rounded-lg p-3 space-y-2.5 bg-secondary/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Card {index + 1}
        </span>
        {canRemove && (
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        )}
      </div>
      {src ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={src} alt="" className="w-full h-28 object-cover" />
          <button
            type="button"
            onClick={() => setValue(`${prefix}.src`, "")}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-1.5 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {uploading ? (
            <span className="text-xs text-muted-foreground">Uploading…</span>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Upload image</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
      )}
      <Input
        {...register(`${prefix}.title`)}
        placeholder="Card title"
        className="text-sm font-medium"
      />
      <Textarea
        {...register(`${prefix}.description`)}
        placeholder="Card description"
        rows={2}
        className="text-sm resize-none"
      />
      <Input
        {...register(`${prefix}.alt`)}
        placeholder="Image alt text (optional)"
        className="text-sm"
      />
    </div>
  );
}

function MediaCardsBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const items =
    (useWatch({ control, name: `${prefix}.items` }) as {
      src: string;
      alt?: string;
      title: string;
      description: string;
    }[]) || [];
  const layout =
    (useWatch({ control, name: `${prefix}.layout` }) as string) || "grid";
  const addItem = () =>
    setValue(`${prefix}.items`, [
      ...items,
      { src: "", alt: "", title: "", description: "" },
    ]);
  const removeItem = (i: number) =>
    setValue(
      `${prefix}.items`,
      items.filter((_, idx) => idx !== i)
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          Layout:
        </span>
        {(["row", "grid", "stack"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setValue(`${prefix}.layout`, l)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              layout === l
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-secondary"
            }`}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
      {items.map((_, i) => (
        <MediaCardsItemEditor
          key={i}
          prefix={`${prefix}.items.${i}`}
          control={control}
          register={register}
          setValue={setValue}
          index={i}
          onRemove={() => removeItem(i)}
          canRemove={items.length > 1}
        />
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Card
      </Button>
    </div>
  );
}

// ─── Comparison Block Editor ──────────────────────────────────────────────────

function ComparisonBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const rows = (useWatch({ control, name: `${prefix}.rows` }) as {
    feature: string;
    left: string;
    right: string;
  }[]) || [{ feature: "", left: "", right: "" }];
  const addRow = () =>
    setValue(`${prefix}.rows`, [...rows, { feature: "", left: "", right: "" }]);
  const removeRow = (i: number) =>
    setValue(
      `${prefix}.rows`,
      rows.filter((_, idx) => idx !== i)
    );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <span className="text-xs font-medium text-muted-foreground px-1">
          Feature
        </span>
        <Input
          {...register(`${prefix}.leftLabel`)}
          placeholder="Left column (e.g. Repair)"
          className="text-sm font-semibold"
        />
        <Input
          {...register(`${prefix}.rightLabel`)}
          placeholder="Right column (e.g. Replace)"
          className="text-sm font-semibold"
        />
      </div>
      <div className="space-y-2">
        {rows.map((_, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 items-center">
            <Input
              {...register(`${prefix}.rows.${i}.feature`)}
              placeholder={`Feature ${i + 1}`}
              className="text-sm"
            />
            <Input
              {...register(`${prefix}.rows.${i}.left`)}
              placeholder="Left value"
              className="text-sm"
            />
            <div className="flex gap-1">
              <Input
                {...register(`${prefix}.rows.${i}.right`)}
                placeholder="Right value"
                className="text-sm flex-1"
              />
              {rows.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeRow(i)}
                  className="flex-shrink-0 px-2"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={addRow}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Row
      </Button>
    </div>
  );
}

// ─── Columns Block Editor ─────────────────────────────────────────────────────

function ColumnEditor({
  prefix,
  colIndex,
  control,
  register,
  setValue,
  onRemove,
  canRemove,
}: {
  prefix: string;
  colIndex: number;
  control: any;
  register: any;
  setValue: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const blocks = (useWatch({
    control,
    name: `${prefix}.blocks`,
  }) as LeafBlockData[]) || [{ type: "paragraph", text: "" }];

  const addBlock = (block: LeafBlockData) =>
    setValue(`${prefix}.blocks`, [...blocks, block]);
  const removeBlock = (i: number) =>
    setValue(
      `${prefix}.blocks`,
      blocks.filter((_, idx) => idx !== i)
    );
  const moveBlock = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setValue(`${prefix}.blocks`, next);
  };

  return (
    <div className="border border-border rounded-lg p-3 space-y-2.5 bg-secondary/20 min-w-0 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Column {colIndex + 1}
        </span>
        {canRemove && (
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        )}
      </div>
      <div className="space-y-2 flex-1">
        {blocks.map((_, bi) => (
          <BlockEditor
            key={bi}
            prefix={`${prefix}.blocks.${bi}`}
            control={control}
            register={register}
            setValue={setValue}
            onRemove={() => removeBlock(bi)}
            onMove={(dir) => moveBlock(bi, dir === "up" ? bi - 1 : bi + 1)}
            canMoveUp={bi > 0}
            canMoveDown={bi < blocks.length - 1}
            allowColumns={false}
          />
        ))}
      </div>
      <AddBlockDropdown
        onAdd={addBlock as (b: BlockData) => void}
        showColumns={false}
      />
    </div>
  );
}

function ColumnsBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const columns =
    (useWatch({ control, name: `${prefix}.columns` }) as {
      blocks: LeafBlockData[];
    }[]) || [];

  const addColumn = () => {
    if (columns.length >= 4) return;
    setValue(`${prefix}.columns`, [
      ...columns,
      { blocks: [{ type: "paragraph", text: "" }] },
    ]);
  };

  const removeColumn = (ci: number) => {
    if (columns.length <= 2) return;
    setValue(
      `${prefix}.columns`,
      columns.filter((_, i) => i !== ci)
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          {columns.length} columns
        </span>
        {columns.length < 4 && (
          <Button type="button" size="sm" variant="outline" onClick={addColumn}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Column
          </Button>
        )}
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((_, ci) => (
          <ColumnEditor
            key={ci}
            prefix={`${prefix}.columns.${ci}`}
            colIndex={ci}
            control={control}
            register={register}
            setValue={setValue}
            onRemove={() => removeColumn(ci)}
            canRemove={columns.length > 2}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Block Editor ─────────────────────────────────────────────────────────────

function BlockEditor({
  prefix,
  control,
  register,
  setValue,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
  allowColumns = true,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  allowColumns?: boolean;
}) {
  const block = useWatch({ control, name: prefix }) as BlockData;
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("content-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("content-images").getPublicUrl(path);
      setValue(`${prefix}.src`, data.publicUrl);
    } catch {
      // silent — user can retry
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!block) return null;

  const blockLabel =
    block.type === "paragraph"
      ? "Paragraph"
      : block.type === "image"
      ? "Image"
      : block.type === "blockquote"
      ? "Blockquote"
      : block.type === "faq"
      ? "FAQ"
      : block.type === "list" && block.style === "bullet"
      ? "Bullet List"
      : block.type === "list" && block.style === "number"
      ? "Numbered List"
      : block.type === "list" && block.style === "letter"
      ? "Letter List"
      : block.type === "media-cards"
      ? "Media Cards"
      : block.type === "comparison"
      ? "Comparison"
      : block.type === "columns"
      ? "Columns"
      : "Block";

  const blockIcon =
    block.type === "paragraph" ? (
      <Type className="w-3.5 h-3.5" />
    ) : block.type === "image" ? (
      <ImageIcon className="w-3.5 h-3.5" />
    ) : block.type === "blockquote" ? (
      <Quote className="w-3.5 h-3.5" />
    ) : block.type === "faq" ? (
      <HelpCircle className="w-3.5 h-3.5" />
    ) : block.type === "list" && block.style === "bullet" ? (
      <List className="w-3.5 h-3.5" />
    ) : block.type === "media-cards" ? (
      <LayoutGrid className="w-3.5 h-3.5" />
    ) : block.type === "comparison" ? (
      <Columns2 className="w-3.5 h-3.5" />
    ) : block.type === "columns" ? (
      <Columns3 className="w-3.5 h-3.5" />
    ) : (
      <ListOrdered className="w-3.5 h-3.5" />
    );

  return (
    <div className="border border-border rounded-lg p-4 bg-background space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {blockIcon} {blockLabel}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onMove("up")}
          disabled={!canMoveUp}
          className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onMove("down")}
          disabled={!canMoveDown}
          className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </Button>
      </div>

      {block.type === "paragraph" && (
        <Textarea
          {...register(`${prefix}.text`)}
          rows={3}
          className="resize-none"
          placeholder="Write your paragraph…"
        />
      )}

      {block.type === "blockquote" && (
        <div className="space-y-2">
          <Textarea
            {...register(`${prefix}.text`)}
            rows={3}
            className="resize-none italic border-l-4 border-primary/30 pl-4"
            placeholder="Write the quote…"
          />
          <Input
            {...register(`${prefix}.cite`)}
            placeholder="Citation / source (optional)"
            className="text-sm"
          />
        </div>
      )}

      {block.type === "image" && (
        <div className="space-y-2">
          {block.src ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={block.src}
                alt={block.alt || ""}
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => setValue(`${prefix}.src`, "")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${
                uploading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {uploading ? (
                <span className="text-sm text-muted-foreground">
                  Uploading…
                </span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">
                    Click to upload image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Input
              {...register(`${prefix}.alt`)}
              placeholder="Alt text (optional)"
              className="text-sm"
            />
            <Input
              {...register(`${prefix}.caption`)}
              placeholder="Caption (optional)"
              className="text-sm"
            />
          </div>
        </div>
      )}

      {block.type === "list" && (
        <ListBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
      {block.type === "faq" && (
        <FaqBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
      {block.type === "media-cards" && (
        <MediaCardsBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
      {block.type === "comparison" && (
        <ComparisonBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
      {block.type === "columns" && (
        <ColumnsBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
    </div>
  );
}

// ─── Section Editor ───────────────────────────────────────────────────────────

function SectionEditor({
  sectionIndex,
  control,
  register,
  setValue,
  onRemove,
  canRemove,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  setValue: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.blocks`,
  });

  return (
    <div className="border border-border rounded-xl p-5 space-y-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>Section Heading</Label>
          <Input
            {...register(`sections.${sectionIndex}.heading`)}
            placeholder="e.g. What Makes This Area Unique"
          />
        </div>
        {canRemove && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="mt-6 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Label>Content Blocks</Label>
        {fields.map((field, bi) => (
          <BlockEditor
            key={field.id}
            prefix={`sections.${sectionIndex}.blocks.${bi}`}
            control={control}
            register={register}
            setValue={setValue}
            onRemove={() => remove(bi)}
            onMove={(dir) => {
              const target = dir === "up" ? bi - 1 : bi + 1;
              if (target >= 0 && target < fields.length) move(bi, target);
            }}
            canMoveUp={bi > 0}
            canMoveDown={bi < fields.length - 1}
          />
        ))}
        <AddBlockDropdown onAdd={(block) => append(block)} />
      </div>
    </div>
  );
}

// ─── Content Sections Editor ──────────────────────────────────────────────────

export default function ContentSectionsEditor({
  control,
  register,
  setValue,
  error,
}: {
  control: any;
  register: any;
  setValue: any;
  error?: string;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Content Sections</h2>
          <p className="text-sm text-muted-foreground">
            Rich SEO content — paragraphs, lists, FAQs, images.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            append({ heading: "", blocks: [{ type: "paragraph", text: "" }] })
          }
        >
          <PlusCircle className="w-4 h-4 mr-1" /> Add Section
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mb-3">{error}</p>}
      <div className="space-y-4">
        {fields.map((section, si) => (
          <SectionEditor
            key={section.id}
            sectionIndex={si}
            control={control}
            register={register}
            setValue={setValue}
            onRemove={() => remove(si)}
            canRemove={fields.length > 0}
          />
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">
            No content sections yet. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
