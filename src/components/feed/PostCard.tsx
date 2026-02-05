 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Flag,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";

export type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  canDelete?: boolean;
};

export type Post = {
  id: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  createdAt: string;
  content: string;
  imageUrl?: string;
  likeCount?: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  isOwn?: boolean;
  comments?: Comment[];
};

interface PostCardProps {
  post: Post;
  footerSlot?: ReactNode;
  /** Current user's username; if same as post author, profile link goes to /profile */
  currentUsername?: string | null;
  onToggleLike?: () => void;
  onToggleSave?: () => void;
  onDelete?: () => void;
  onAddComment?: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export function PostCard({
  post,
  footerSlot,
  currentUsername = null,
  onToggleLike,
  onToggleSave,
  onDelete,
  onAddComment,
  onDeleteComment,
}: PostCardProps) {
  const liked = post.likedByMe ?? false;
  const likeCount = Math.max(0, post.likeCount ?? 0);
  const saved = post.savedByMe ?? false;
  const comments = post.comments ?? [];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [showComments, setShowComments] = useState(false);

  const profileHref =
    currentUsername !== undefined && currentUsername !== null && post.author.name === currentUsername
      ? "/profile"
      : `/profile/${encodeURIComponent(post.author.name)}`;

  const baseUrl =
    (typeof window !== "undefined" && window.location.origin) ||
    (process.env.NEXT_PUBLIC_APP_URL ?? "https://bloggy-front.onrender.com");

  const handleShare = async () => {
    const url = `${baseUrl}/p/${post.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      // swallow errors for demo
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    }
  };

  const handleSubmitComment = () => {
    const trimmed = commentValue.trim();
    if (!trimmed) return;
    onAddComment?.(trimmed);
    setCommentValue("");
  };

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md hover:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:ring-zinc-700">
      {/* Header */}
      <header className="mb-3 flex items-start gap-3">
        <Link
          href={profileHref}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          {post.author.avatarInitials}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={profileHref}
                className="truncate text-sm font-medium text-zinc-900 transition hover:underline dark:text-zinc-50"
              >
                {post.author.name}
              </Link>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {post.author.role}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {post.createdAt}
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                  aria-label="Post actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {isMenuOpen ? (
                  <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-zinc-200 bg-white/95 p-1 text-xs shadow-md backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSave?.();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {saved ? (
                        <BookmarkCheck className="h-3.5 w-3.5" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                      <span>{saved ? "Unsave" : "Save"}</span>
                    </button>
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDelete?.();
                          setIsMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
                        <span>Delete</span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      <span>Report</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
        <p className="whitespace-pre-line">{post.content}</p>
        {post.imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={post.imageUrl}
              alt=""
              width={1200}
              height={675}
              className="h-64 w-full object-cover sm:h-72"
            />
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <footer className="mt-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Social
          </p>
          {footerSlot}
        </div>
        <div className="flex items-center justify-between gap-1 text-xs sm:text-sm">
          <button
            type="button"
            onClick={onToggleLike}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 transition active:scale-95 ${
              liked
                ? "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <ThumbsUp
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                liked ? "fill-current" : ""
              }`}
            />
            <span>Like{likeCount > 0 ? ` · ${likeCount}` : ""}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 transition ${
              showComments
                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Comment{comments.length > 0 ? ` · ${comments.length}` : ""}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={onToggleSave}
            className={`hidden flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs transition active:scale-95 sm:flex ${
              saved
                ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {saved ? (
              <BookmarkCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
        </div>
        {shareCopied ? (
          <p className="mt-2 text-[11px] text-emerald-500 dark:text-emerald-400">
            Link copied
          </p>
        ) : null}

        {/* Comments */}
        {showComments && (
        <div className="mt-3 space-y-2">
          {comments.length > 0 ? (
            <ul className="space-y-1.5">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex items-start gap-2 rounded-xl bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <div className="flex-1">
                    <span className="font-medium">{comment.authorName}</span>{" "}
                    <span className="text-zinc-400 dark:text-zinc-500">
                      • {comment.createdAt}
                    </span>
                    <p className="mt-0.5">{comment.content}</p>
                  </div>
                  {comment.canDelete && onDeleteComment ? (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment.id)}
                      className="ml-1 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {onAddComment ? (
            <div className="flex items-center gap-2 pt-1">
              <div className="h-6 w-6 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-1 items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                <input
                  type="text"
                  value={commentValue}
                  onChange={(event) => setCommentValue(event.target.value)}
                  placeholder="Add a comment..."
                  className="min-w-0 flex-1 bg-transparent text-zinc-800 placeholder:text-zinc-400 outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={!commentValue.trim()}
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  Post
                </button>
              </div>
            </div>
          ) : null}
        </div>
        )}
      </footer>
    </article>
  );
}

