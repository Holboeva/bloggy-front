 "use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CreatePostBar } from "@/components/feed/CreatePostBar";
import { PostCard, type Comment, type Post } from "@/components/feed/PostCard";
import { apiDelete, apiGet, apiPost, getCurrentUser } from "@/lib/api";
import { getAvatarInitials } from "@/lib/avatar";
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
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const [postsData, me] = await Promise.all([
          apiGet<ApiPaginatedPosts>("/posts/"),
          getCurrentUser().catch(() => null),
        ]);
        const data = postsData;
        const myUsername = me?.username ?? null;
        if (isMounted) setCurrentUsername(myUsername);

        const mappedPosts: Post[] = data.results.map((post) => ({
          id: String(post.id),
          author: {
            name: post.author,
            role: "Bloggy member",
            avatarInitials: getAvatarInitials(undefined, undefined, post.author),
          },
          createdAt: new Date(post.created_at).toLocaleString(),
          content: post.content,
          likeCount: post.likes_count,
          likedByMe: false,
          savedByMe: false,
          isOwn: myUsername != null && post.author === myUsername,
          comments: [],
        }));

        if (!isMounted) return;
        setPosts(mappedPosts);

        // Optionally, pre-load comments for these posts
        await Promise.all(
          mappedPosts.map(async (post) => {
            try {
              const raw = await apiGet<ApiComment[] | { results: ApiComment[] }>(
                `/posts/${post.id}/comments/`,
              );
              const commentsList: ApiComment[] = Array.isArray(raw)
                ? raw
                : (raw?.results ?? []);
              if (!isMounted) return;
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === post.id
                    ? {
                        ...p,
                        comments: commentsList.map<Comment>((c) => ({
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
        avatarInitials: getAvatarInitials(undefined, undefined, created.author),
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
      const created = await apiPost<ApiComment, { post: number; content: string }>(
        `/posts/${id}/comments/`,
        { post: Number(id), content },
      );

      const newComment: Comment = {
        id: String(created.id),
        authorName: created.author,
        content: created.content,
        createdAt: new Date(created.created_at).toLocaleString(),
        canDelete: true,
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

  const handleDeleteComment = (postId: string, commentId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments ?? []).filter(
                (comment) => comment.id !== commentId,
              ),
            }
          : post,
      ),
    );

    void apiDelete<unknown>(`/posts/${postId}/comments/${commentId}/`).catch(() => {
      // If delete fails, we could refetch comments; ignored for now
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
              currentUsername={currentUsername}
              onToggleLike={() => handleToggleLike(post.id)}
              onToggleSave={() => handleToggleSave(post.id)}
              onDelete={
                post.isOwn ? () => handleDeletePost(post.id) : undefined
              }
              onAddComment={(content) => handleAddComment(post.id, content)}
              onDeleteComment={(commentId) =>
                handleDeleteComment(post.id, commentId)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

