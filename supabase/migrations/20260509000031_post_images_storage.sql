-- Post cover image storage bucket policies
-- The bucket already exists; this adds the missing RLS policies
-- Run this in the Supabase SQL editor

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
