"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Post, ContentBlock } from "@/lib/supabase/posts";
import { normalizeContent } from "@/lib/supabase/posts";
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
import { Upload, X } from "lucide-react";
import { convertToWebp } from "@/lib/convertToWebp";
import ContentSectionsEditor, { blockSchema, sectionSchema } from "@/components/admin/ContentSectionsEditor";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title:            z.string().min(1, "Required"),
  slug:             z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  type:             z.enum(["Guide", "Article", "Case Study", "Video"]),
  description:      z.string().min(1, "Required"),
  meta_description: z.string().min(1, "Required"),
  date:             z.string().min(1, "Required"),
  read_time:        z.string().min(1, "Required"),
  related_slugs:    z.string(),
  category:         z.string(),
  published:        z.boolean(),
  pinned:           z.boolean(),
  sections:         z.array(sectionSchema).min(1, "At least one section is required"),
});

type FormData = z.infer<typeof schema>;
type BlockData = z.infer<typeof blockSchema>;

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function contentBlocksToFormBlocks(content: (string | ContentBlock)[]): BlockData[] {
  const normalized = normalizeContent(content);
  return normalized.map((b) => {
    if (b.type === "list") return { ...b, items: [...b.items] };
    return { ...b };
  }) as BlockData[];
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(post?.image_url ?? "");
  const isEdit = !!post;

  const defaultSections =
    post?.post_sections?.map((s) => ({
      heading: s.heading,
      blocks: contentBlocksToFormBlocks(s.content),
    })) ?? [{ heading: "", blocks: [{ type: "paragraph" as const, text: "" }] }];

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:            post?.title ?? "",
      slug:             post?.slug ?? "",
      type:             post?.type ?? "Article",
      description:      post?.description ?? "",
      meta_description: post?.meta_description ?? "",
      date:             post?.date ?? "",
      read_time:        post?.read_time ?? "",
      related_slugs:    post?.related_slugs?.join(", ") ?? "",
      category:         post?.category ?? "",
      published:        post?.published ?? false,
      pinned:           post?.pinned ?? false,
      sections:         defaultSections,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const postData = {
      slug:             data.slug,
      type:             data.type,
      title:            data.title,
      description:      data.description,
      meta_description: data.meta_description,
      date:             data.date,
      read_time:        data.read_time,
      related_slugs:    data.related_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      category:         data.category || null,
      published:        data.published,
      pinned:           data.pinned,
      image_url:        imageUrl || null,
      updated_at:       new Date().toISOString(),
    };

    try {
      let postId = post?.id;

      if (isEdit) {
        const { error } = await supabase.from("posts").update(postData).eq("id", postId!);
        if (error) throw error;
        await supabase.from("post_sections").delete().eq("post_id", postId!);
        await logActivity("update", "posts", `Updated post: ${data.title}`);
      } else {
        const { data: newPost, error } = await supabase.from("posts").insert(postData).select().single();
        if (error) throw error;
        postId = newPost.id;
        await logActivity("create", "posts", `Created post: ${data.title}`);
      }

      const sections = data.sections.map((s, i) => ({
        post_id:  postId!,
        heading:  s.heading,
        content:  s.blocks as ContentBlock[],
        position: i,
      }));

      const { error: sectionsError } = await supabase.from("post_sections").insert(sections);
      if (sectionsError) throw sectionsError;

      router.push("/admin/posts");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const sectionsError = errors.sections && !Array.isArray(errors.sections) ? errors.sections.message : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving…" : uploading ? "Uploading…" : "Save Post"}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>
      )}

      {/* Basic fields */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            onBlur={(e) => { if (!isEdit) setValue("slug", toSlug(e.target.value)); }}
            placeholder="The Complete Guide to…"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Slug <span className="text-muted-foreground font-normal text-xs">(auto-generated, editable)</span></Label>
          <Input {...register("slug")} placeholder="my-post-title" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Guide", "Article", "Case Study", "Video"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Category <span className="text-muted-foreground font-normal text-xs">e.g. Refrigeration, Air Conditioning</span></Label>
          <Input {...register("category")} placeholder="e.g. Refrigeration" />
        </div>

        <div className="space-y-1.5">
          <Label>Date <span className="text-muted-foreground font-normal text-xs">e.g. Mar 2026</span></Label>
          <Input {...register("date")} placeholder="Mar 2026" />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Read Time <span className="text-muted-foreground font-normal text-xs">e.g. 8 min read</span></Label>
          <Input {...register("read_time")} placeholder="8 min read" />
          {errors.read_time && <p className="text-xs text-destructive">{errors.read_time.message}</p>}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Description <span className="text-muted-foreground font-normal text-xs">shown on the card</span></Label>
          <Textarea {...register("description")} rows={2} className="resize-none" />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Meta Description <span className="text-muted-foreground font-normal text-xs">SEO — keep under 160 chars</span></Label>
          <Textarea {...register("meta_description")} rows={2} className="resize-none" />
          {errors.meta_description && <p className="text-xs text-destructive">{errors.meta_description.message}</p>}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Related Post Slugs <span className="text-muted-foreground font-normal text-xs">comma-separated</span></Label>
          <Input {...register("related_slugs")} placeholder="slug-one, slug-two, slug-three" />
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="published"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} id="published" />}
          />
          <Label htmlFor="published" className="cursor-pointer">Published</Label>
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="pinned"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} id="pinned" />}
          />
          <Label htmlFor="pinned" className="cursor-pointer">
            Pin to top <span className="text-muted-foreground font-normal text-xs">(always shown first on the resources page)</span>
          </Label>
        </div>
      </div>

      {/* Cover image */}
      <div className="space-y-3">
        <Label>Cover Image <span className="text-muted-foreground font-normal text-xs">(optional — shown on card and article page)</span></Label>
        {imageUrl ? (
          <div className="relative w-full rounded-xl overflow-hidden border border-border">
            <img src={imageUrl} alt="Cover" className="w-full h-48 object-cover" />
            <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            {uploading ? (
              <span className="text-sm text-muted-foreground">Uploading…</span>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Click to upload cover image</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WebP — converted to WebP</span>
              </>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading} onChange={handleImageUpload} />
          </label>
        )}
      </div>

      {/* Content Sections */}
      <ContentSectionsEditor control={control} register={register} setValue={setValue} error={sectionsError} />
    </form>
  );
}
