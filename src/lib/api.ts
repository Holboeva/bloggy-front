const API_BASE_URL = "https://bloggy-startup.onrender.com/api";

export type TokenResponse = {
  access: string;
  refresh: string;
};

export type RefreshTokenResponse = {
  access: string;
};

export interface ApiErrorShape {
  status: number;
  message: string;
  detail?: unknown;
}

export class ApiError extends Error implements ApiErrorShape {
  status: number;
  detail?: unknown;

  constructor({ status, message, detail }: ApiErrorShape) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

const ACCESS_KEY = "bloggy_access";
const REFRESH_KEY = "bloggy_refresh";

// Token management
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCESS_KEY, access);
    window.localStorage.setItem(REFRESH_KEY, refresh);
  } catch {
    // ignore localStorage errors
  }
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  } catch {
    // ignore localStorage errors
  }
}

// Token refresh logic
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return null;
      }

      const data = (await response.json()) as RefreshTokenResponse;
      const accessToken = getAccessToken();
      const currentRefresh = getRefreshToken();
      if (currentRefresh) {
        setTokens(data.access, currentRefresh);
      }
      return data.access;
    } catch {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
  retryOn401?: boolean;
}

export async function apiRequest<TResponse>(
  path: string,
  { auth = true, headers, retryOn401 = true, ...init }: ApiRequestOptions = {},
): Promise<TResponse> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const mergedHeaders: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      (mergedHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  let response = await fetch(url, {
    ...init,
    headers: mergedHeaders,
  });

  // Handle 401 with token refresh
  if (response.status === 401 && auth && retryOn401 && !isRefreshing) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      // Retry original request with new token
      (mergedHeaders as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...init,
        headers: mergedHeaders,
      });
    } else {
      // Refresh failed, redirect handled in refreshAccessToken
      throw new ApiError({
        status: 401,
        message: "Authentication failed",
      });
    }
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "detail" in data &&
        typeof (data as any).detail === "string" &&
        (data as any).detail) ||
      response.statusText ||
      "Request failed";

    throw new ApiError({
      status: response.status,
      message,
      detail: data,
    });
  }

  return data as TResponse;
}

// Convenience helpers

export function apiGet<T>(path: string, options?: Omit<ApiRequestOptions, "method">) {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export function apiPost<T, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<ApiRequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(
  path: string,
  options?: Omit<ApiRequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, {
    ...options,
    method: "DELETE",
  });
}

export function apiPatch<T, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<ApiRequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// Auth types
export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
};

// Auth helpers (no auth header for login/register)
export async function register(payload: RegisterPayload): Promise<unknown> {
  const body = {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    ...(payload.first_name != null && { first_name: payload.first_name }),
    ...(payload.last_name != null && { last_name: payload.last_name }),
    ...(payload.bio != null && { bio: payload.bio }),
  };
  const response = await fetch(`${API_BASE_URL}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = parseBackendErrorMessage(errorData);
    throw new ApiError({ status: response.status, message, detail: errorData });
  }

  return response.json().catch(() => ({}));
}

function parseBackendErrorMessage(errorData: unknown): string {
  if (!errorData || typeof errorData !== "object") return "Something went wrong";
  const o = errorData as Record<string, string[] | string | undefined>;
  if (typeof o.detail === "string") return o.detail;
  if (Array.isArray(o.username) && o.username[0]) return o.username[0];
  if (Array.isArray(o.email) && o.email[0]) return o.email[0];
  if (Array.isArray(o.password) && o.password[0]) return o.password[0];
  if (Array.isArray(o.non_field_errors) && o.non_field_errors[0]) return o.non_field_errors[0];
  return "Something went wrong";
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = parseBackendErrorMessage(errorData);
    throw new ApiError({ status: response.status, message, detail: errorData });
  }

  const tokens = (await response.json()) as TokenResponse;
  setTokens(tokens.access, tokens.refresh);
  return tokens;
}

export function logout(): void {
  clearTokens();
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

// Profile (authenticated)
export type UserProfile = {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  skills?: string[];
};

export async function getCurrentUser(): Promise<UserProfile> {
  return apiGet<UserProfile>("/users/me/");
}

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  bio?: string;
  skills?: string[];
};

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiPatch<UserProfile>("/users/me/", payload);
}

