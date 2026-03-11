"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/supabase/posts";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const togglePublish = async (post: Post) => {
    const supabase = createClient();
    await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    await logActivity("update", "posts", `${!post.published ? "Published" : "Unpublished"} post: ${post.title}`);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, published: !p.published } : p
      )
    );
  };

  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", post.id);
    await logActivity("delete", "posts", `Deleted post: ${post.title}`);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-1" /> New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No posts yet.{" "}
          <Link href="/admin/posts/new" className="text-primary underline">
            Create your first one.
          </Link>
        </p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  className={
                    i < posts.length - 1 ? "border-b border-border" : ""
                  }
                >
                  <td className="px-4 py-3 font-medium max-w-[220px] truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary">{post.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(post)}
                      className="focus:outline-none"
                      title="Toggle publish status"
                    >
                      <Badge
                        variant={post.published ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {post.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePost(post)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
