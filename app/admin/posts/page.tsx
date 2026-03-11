import { createClient } from "@/lib/supabase/server";
import { getAllPosts } from "@/lib/supabase/posts";
import PostsClient from "./PostsClient";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = await createClient();
  const posts = await getAllPosts(supabase);
  return <PostsClient initialPosts={posts} />;
}
