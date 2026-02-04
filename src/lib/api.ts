const API_BASE_URL = "https://bloggy-startup.onrender.com";

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

// Token management
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("bloggy_access_token");
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("bloggy_refresh_token");
  } catch {
    return null;
  }
}

function setTokens(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("bloggy_access_token", access);
    window.localStorage.setItem("bloggy_refresh_token", refresh);
  } catch {
    // ignore localStorage errors
  }
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("bloggy_access_token");
    window.localStorage.removeItem("bloggy_refresh_token");
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
      const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
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

// Auth helpers
export async function login(username: string, password: string): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError({
      status: response.status,
      message: "Invalid credentials",
      detail: errorData,
    });
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

