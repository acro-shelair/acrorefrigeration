-- Post/content block image storage bucket
-- Stores images used in post covers, content blocks (image type, media-cards items)
-- Run this in the Supabase SQL editor

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Auth upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Auth update post images"
  on storage.objects for update
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Auth delete post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Public read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');
