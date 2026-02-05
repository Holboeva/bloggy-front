 "use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface CreatePostBarProps {
  onSubmit?: (value: string) => void | Promise<void>;
}

const MAX_LENGTH = 280;

export function CreatePostBar({ onSubmit }: CreatePostBarProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const remaining = MAX_LENGTH - value.length;
  const isTooLong = value.length > MAX_LENGTH;
  const isEmpty = value.trim().length === 0;
  const isDisabled = isSubmitting || isEmpty || isTooLong;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Write something before posting.");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Posts are limited to ${MAX_LENGTH} characters.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit?.(trimmed);
      setValue("");
    } catch {
      setError("Something went wrong while posting. Please try again.");
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-sm ring-1 ring-transparent transition focus-within:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus-within:ring-zinc-700 sm:p-4"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-[11px] font-semibold text-white shadow-sm">
        BG
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <input
          ref={inputRef}
          type="text"
          name="content"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          maxLength={MAX_LENGTH + 50}
          placeholder="Share an update, idea, or question..."
          className="h-9 w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {remaining >= 0 ? `${remaining} characters left` : `${-remaining} over limit`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isDisabled}
              className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    </form>
  );
}

