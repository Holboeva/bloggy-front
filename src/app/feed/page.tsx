 "use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CreatePostBar } from "@/components/feed/CreatePostBar";
import { PostCard, type Comment, type Post } from "@/components/feed/PostCard";

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Amina Karimova",
      role: "Product Designer · Tashkent",
      avatarInitials: "AK",
    },
    createdAt: "2h ago",
    content:
      "Just wrapped the first design sprint for Bloggy’s portfolio templates. Focusing on a clean, distraction-free reading experience inspired by Medium + Notion.",
    imageUrl: "/file.svg",
    likeCount: 18,
    likedByMe: false,
    savedByMe: false,
    isOwn: false,
    comments: [],
  },
  {
    id: "2",
    author: {
      name: "Javlon Nazirov",
      role: "Full-stack Engineer · Remote",
      avatarInitials: "JN",
    },
    createdAt: "6h ago",
    content:
      "Experimenting with a content recommendation engine for early-stage founders on Bloggy. Curious how people currently discover co-founders and first hires.",
    likeCount: 7,
    likedByMe: true,
    savedByMe: false,
    isOwn: false,
    comments: [],
  },
  {
    id: "3",
    author: {
      name: "Studio Orbit",
      role: "Design studio · Portfolio update",
      avatarInitials: "SO",
    },
    createdAt: "Yesterday",
    content:
      "Published a new case study on how we helped a fintech startup go from rough idea to fully functional MVP in 6 weeks using a lean design system.",
    imageUrl: "/window.svg",
    likeCount: 42,
    likedByMe: false,
    savedByMe: true,
    isOwn: false,
    comments: [],
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(() => INITIAL_POSTS);

  const handleCreatePost = async (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: "You",
        role: "Bloggy member",
        avatarInitials: "YO",
      },
      createdAt: "Just now",
      content,
      likeCount: 0,
      likedByMe: false,
      savedByMe: false,
      isOwn: true,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const likedByMe = !post.likedByMe;
        const baseCount = Math.max(0, post.likeCount ?? 0);
        const likeCount = likedByMe
          ? baseCount + 1
          : Math.max(0, baseCount - 1);
        return { ...post, likedByMe, likeCount };
      }),
    );
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
  };

  const handleAddComment = (id: string, content: string) => {
    const newComment: Comment = {
      id: `${id}-${Date.now()}`,
      authorName: "You",
      content,
      createdAt: "Just now",
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
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Feed"
        description="Your social-professional timeline. See posts, updates, and ideas from people you follow on Bloggy."
      />

      <CreatePostBar onSubmit={handleCreatePost} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={() => handleToggleLike(post.id)}
            onToggleSave={() => handleToggleSave(post.id)}
            onDelete={post.isOwn ? () => handleDeletePost(post.id) : undefined}
            onAddComment={(content) => handleAddComment(post.id, content)}
          />
        ))}
      </div>
    </section>
  );
}

