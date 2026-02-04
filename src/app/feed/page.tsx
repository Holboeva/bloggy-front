 "use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CreatePostBar } from "@/components/feed/CreatePostBar";
import { PostCard, type Comment, type Post } from "@/components/feed/PostCard";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type ApiPost = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  likes_count: number;
};

type ApiComment = {
  id: number;
  post: number;
  author: string;
  content: string;
  created_at: string;
};

type ApiPaginatedPosts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiPost[];
};

export default function FeedPage() {
  useRequireAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await apiGet<ApiPaginatedPosts>("/posts/");

        const mappedPosts: Post[] = data.results.map((post) => ({
          id: String(post.id),
          author: {
            name: post.author,
            role: "Bloggy member",
            avatarInitials: post.author.slice(0, 2).toUpperCase(),
          },
          createdAt: new Date(post.created_at).toLocaleString(),
          content: post.content,
          likeCount: post.likes_count,
          likedByMe: false,
          savedByMe: false,
          isOwn: false,
          comments: [],
        }));

        if (!isMounted) return;
        setPosts(mappedPosts);

        // Optionally, pre-load comments for these posts
        await Promise.all(
          mappedPosts.map(async (post) => {
            try {
              const comments = await apiGet<ApiComment[]>(
                `/posts/${post.id}/comments/`,
              );
              if (!isMounted) return;
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === post.id
                    ? {
                        ...p,
                        comments: comments.map<Comment>((c) => ({
                          id: String(c.id),
                          authorName: c.author,
                          content: c.content,
                          createdAt: new Date(c.created_at).toLocaleString(),
                        })),
                      }
                    : p,
                ),
              );
            } catch {
              // ignore comment load errors for now
            }
          }),
        );
      } catch (error: any) {
        if (!isMounted) return;
        setLoadError(
          typeof error?.message === "string"
            ? error.message
            : "Failed to load feed.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePost = async (content: string) => {
    const created = await apiPost<ApiPost, { content: string }>(
      "/posts/",
      { content },
    );

    const newPost: Post = {
      id: String(created.id),
      author: {
        name: created.author,
        role: "Bloggy member",
        avatarInitials: created.author.slice(0, 2).toUpperCase(),
      },
      createdAt: new Date(created.created_at).toLocaleString(),
      content: created.content,
      likeCount: created.likes_count,
      likedByMe: false,
      savedByMe: false,
      isOwn: true,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByMe: !post.likedByMe,
              likeCount: (post.likeCount ?? 0) + (post.likedByMe ? -1 : 1),
            }
          : post,
      ),
    );

    void apiPost<{ liked: boolean }>(`/posts/${id}/like/`, {}).catch(() => {
      // Simple rollback if needed
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                likedByMe: !post.likedByMe,
                likeCount: (post.likeCount ?? 0) + (post.likedByMe ? -1 : 1),
              }
            : post,
        ),
      );
    });
  };

  const handleToggleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, savedByMe: !post.savedByMe } : post,
      ),
    );
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
    void apiDelete<unknown>(`/posts/${id}/`).catch(() => {
      // if delete fails, we could refetch; for now, ignore for demo
    });
  };

  const handleAddComment = (id: string, content: string) => {
    void (async () => {
      const created = await apiPost<ApiComment, { content: string }>(
        `/posts/${id}/comments/`,
        { content },
      );

      const newComment: Comment = {
        id: String(created.id),
        authorName: created.author,
        content: created.content,
        createdAt: new Date(created.created_at).toLocaleString(),
      };

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                comments: [...(post.comments ?? []), newComment],
              }
            : post,
        ),
      );
    })().catch(() => {
      // For demo, swallow comment errors
    });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Feed"
        description="Your social-professional timeline. See posts, updates, and ideas from people you follow on Bloggy."
      />

      <CreatePostBar onSubmit={handleCreatePost} />

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading feed...
        </p>
      ) : loadError ? (
        <p className="text-sm text-red-500 dark:text-red-400">{loadError}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={() => handleToggleLike(post.id)}
              onToggleSave={() => handleToggleSave(post.id)}
              onDelete={
                post.isOwn ? () => handleDeletePost(post.id) : undefined
              }
              onAddComment={(content) => handleAddComment(post.id, content)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

