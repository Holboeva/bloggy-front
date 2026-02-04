"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register as apiRegister, login } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);
      await apiRegister({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });
      await login(trimmedUsername, password);
      router.push("/feed");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as { message: string }).message === "string"
          ? (err as { message: string }).message
          : "Registration failed. Try a different username or email.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Create your account
          </h1>
          <p className="text-sm text-zinc-400">
            Join Bloggy to share posts and build your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
              placeholder="Choose a username"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-300"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600"
              placeholder="Repeat your password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-200 underline hover:text-zinc-50"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
