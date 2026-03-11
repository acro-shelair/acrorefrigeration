"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/supabase/posts";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

// ─── Schema ────────────────────────────────────────────────────────────────

const sectionSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  content: z
    .array(z.object({ text: z.string().min(1, "Paragraph cannot be empty") }))
    .min(1),
});

const schema = z.object({
  title: z.string().min(1, "Required"),
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  type: z.enum(["Guide", "Article", "Case Study", "Video"]),
  description: z.string().min(1, "Required"),
  meta_description: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  read_time: z.string().min(1, "Required"),
  related_slugs: z.string(),
  published: z.boolean(),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

type FormData = z.infer<typeof schema>;

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Section sub-component ─────────────────────────────────────────────────

function SectionEditor({
  sectionIndex,
  control,
  register,
  onRemove,
  canRemove,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.content`,
  });

  return (
    <div className="border border-border rounded-xl p-5 space-y-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>Section Heading</Label>
          <Input
            {...register(`sections.${sectionIndex}.heading`)}
            placeholder="e.g. Why This Matters"
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
        <Label>Paragraphs</Label>
        {fields.map((field, pi) => (
          <div key={field.id} className="flex gap-2">
            <Textarea
              {...register(`sections.${sectionIndex}.content.${pi}.text`)}
              rows={3}
              className="flex-1 resize-none"
              placeholder={`Paragraph ${pi + 1}`}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(pi)}
                className="mt-1 flex-shrink-0 self-start"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append({ text: "" })}
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Paragraph
        </Button>
      </div>
    </div>
  );
}

// ─── Main editor ───────────────────────────────────────────────────────────

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!post;

  const defaultSections =
    post?.post_sections?.map((s) => ({
      heading: s.heading,
      content: s.content.map((t) => ({ text: t })),
    })) ?? [{ heading: "", content: [{ text: "" }] }];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      type: post?.type ?? "Article",
      description: post?.description ?? "",
      meta_description: post?.meta_description ?? "",
      date: post?.date ?? "",
      read_time: post?.read_time ?? "",
      related_slugs: post?.related_slugs?.join(", ") ?? "",
      published: post?.published ?? false,
      sections: defaultSections,
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control, name: "sections" });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const postData = {
      slug: data.slug,
      type: data.type,
      title: data.title,
      description: data.description,
      meta_description: data.meta_description,
      date: data.date,
      read_time: data.read_time,
      related_slugs: data.related_slugs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      published: data.published,
      updated_at: new Date().toISOString(),
    };

    try {
      let postId = post?.id;

      if (isEdit) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", postId!);
        if (error) throw error;
        await supabase.from("post_sections").delete().eq("post_id", postId!);
        await logActivity("update", "posts", `Updated post: ${data.title}`);
      } else {
        const { data: newPost, error } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();
        if (error) throw error;
        postId = newPost.id;
        await logActivity("create", "posts", `Created post: ${data.title}`);
      }

      const sections = data.sections.map((s, i) => ({
        post_id: postId!,
        heading: s.heading,
        content: s.content.map((c) => c.text),
        position: i,
      }));

      const { error: sectionsError } = await supabase
        .from("post_sections")
        .insert(sections);
      if (sectionsError) throw sectionsError;

      router.push("/admin/posts");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Post"}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {serverError}
        </p>
      )}

      {/* Basic fields */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            onBlur={(e) => {
              if (!isEdit) setValue("slug", toSlug(e.target.value));
            }}
            placeholder="The Complete Guide to…"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Slug{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (auto-generated, editable)
            </span>
          </Label>
          <Input {...register("slug")} placeholder="my-post-title" />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Guide", "Article", "Case Study", "Video"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Date{" "}
            <span className="text-muted-foreground font-normal text-xs">
              e.g. Mar 2026
            </span>
          </Label>
          <Input {...register("date")} placeholder="Mar 2026" />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Read Time{" "}
            <span className="text-muted-foreground font-normal text-xs">
              e.g. 8 min read
            </span>
          </Label>
          <Input {...register("read_time")} placeholder="8 min read" />
          {errors.read_time && (
            <p className="text-xs text-destructive">
              {errors.read_time.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              shown on the card
            </span>
          </Label>
          <Textarea
            {...register("description")}
            rows={2}
            className="resize-none"
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Meta Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              SEO — keep under 160 chars
            </span>
          </Label>
          <Textarea
            {...register("meta_description")}
            rows={2}
            className="resize-none"
          />
          {errors.meta_description && (
            <p className="text-xs text-destructive">
              {errors.meta_description.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Related Post Slugs{" "}
            <span className="text-muted-foreground font-normal text-xs">
              comma-separated
            </span>
          </Label>
          <Input
            {...register("related_slugs")}
            placeholder="slug-one, slug-two, slug-three"
          />
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="published"
              />
            )}
          />
          <Label htmlFor="published" className="cursor-pointer">
            Published
          </Label>
        </div>
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Content Sections</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              appendSection({ heading: "", content: [{ text: "" }] })
            }
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add Section
          </Button>
        </div>
        {errors.sections && !Array.isArray(errors.sections) && (
          <p className="text-xs text-destructive mb-3">
            {errors.sections.message}
          </p>
        )}
        <div className="space-y-4">
          {sectionFields.map((section, si) => (
            <SectionEditor
              key={section.id}
              sectionIndex={si}
              control={control}
              register={register}
              onRemove={() => removeSection(si)}
              canRemove={sectionFields.length > 1}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
