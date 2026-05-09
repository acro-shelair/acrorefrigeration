"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { LocationCity, LocationStat } from "@/lib/supabase/content";
import type { ContentBlock } from "@/lib/supabase/posts";
import { normalizeContent } from "@/lib/supabase/posts";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import ContentSectionsEditor, { blockSchema, sectionSchema } from "@/components/admin/ContentSectionsEditor";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:               z.string().min(1, "Required"),
  slug:               z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  region_description: z.string().min(1, "Required"),
  zones:              z.string(),
  sample_suburbs:     z.string(),
  sections:           z.array(sectionSchema),
});

type FormData = z.infer<typeof schema>;

// ─── Stats Editor ─────────────────────────────────────────────────────────────

function StatsEditor({ stats, onChange }: { stats: LocationStat[]; onChange: (s: LocationStat[]) => void }) {
  const update = (i: number, field: "label" | "value", val: string) => {
    const next = [...stats];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const add = () => onChange([...stats, { label: "", value: "" }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label>Stats</Label>
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input placeholder="Value" value={stat.value} onChange={(e) => update(i, "value", e.target.value)} className="w-28 flex-shrink-0" />
          <Input placeholder="Label" value={stat.label} onChange={(e) => update(i, "label", e.target.value)} className="flex-1" />
          <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={add}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Stat
      </Button>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function CityEditor({ city }: { city: LocationCity }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stats, setStats] = useState<LocationStat[]>(city.stats ?? []);

  const defaultSections = (city.city_sections ?? []).map((s) => ({
    heading: s.heading,
    blocks: normalizeContent(s.blocks) as z.infer<typeof blockSchema>[],
  }));

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:               city.name,
      slug:               city.slug,
      region_description: city.region_description,
      zones:              city.zones?.join(", ") ?? "",
      sample_suburbs:     city.sample_suburbs?.join(", ") ?? "",
      sections:           defaultSections,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const payload = {
      name:               data.name,
      slug:               data.slug,
      region_description: data.region_description,
      zones:              data.zones.split(",").map((s) => s.trim()).filter(Boolean),
      sample_suburbs:     data.sample_suburbs.split(",").map((s) => s.trim()).filter(Boolean),
      stats:              stats.filter((s) => s.label.trim() && s.value.trim()),
      city_sections:      data.sections.map((s) => ({
        heading: s.heading,
        blocks:  s.blocks as ContentBlock[],
      })),
    };

    try {
      const { error } = await supabase.from("location_cities").update(payload).eq("id", city.id);
      if (error) throw error;
      await logActivity("update", "locations", `Updated city: ${data.name}`);
      router.push("/admin/locations");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit City — {city.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage metadata, precinct cards, and SEO content sections.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save City"}</Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>
      )}

      {/* Metadata */}
      <div className="border border-border rounded-xl p-5 bg-card space-y-5">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Metadata</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>City Name</Label>
            <Input {...register("name")} placeholder="Brisbane" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input {...register("slug")} placeholder="brisbane" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Region Description <span className="text-muted-foreground font-normal text-xs">used as hero subheading and meta description</span></Label>
            <Textarea {...register("region_description")} rows={2} className="resize-none" />
            {errors.region_description && <p className="text-xs text-destructive">{errors.region_description.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Zones <span className="text-muted-foreground font-normal text-xs">comma-separated</span></Label>
            <Input {...register("zones")} placeholder="CBD, Northside, Southside" />
          </div>
          <div className="space-y-1.5">
            <Label>Sample Suburbs <span className="text-muted-foreground font-normal text-xs">comma-separated</span></Label>
            <Input {...register("sample_suburbs")} placeholder="Fortitude Valley, Chermside" />
          </div>
        </div>
        <StatsEditor stats={stats} onChange={setStats} />
      </div>

      {/* Content Sections */}
      <ContentSectionsEditor control={control} register={register} setValue={setValue} />
    </form>
  );
}
