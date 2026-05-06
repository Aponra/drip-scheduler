export const ACCESS_COOKIE = "gd_access_token";
export const REFRESH_COOKIE = "gd_refresh_token";
export const EXPIRY_COOKIE = "gd_expires_at";

const ACCESS_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
};

type CookieJar = {
  set: (name: string, value: string, options?: CookieOptions) => unknown;
  delete: (name: string) => unknown;
};

function baseOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function setTokenCookies(
  jar: CookieJar,
  tokens: {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
  },
) {
  if (tokens.access_token) {
    jar.set(ACCESS_COOKIE, tokens.access_token, {
      ...baseOptions(),
      maxAge: ACCESS_MAX_AGE,
    });
  }
  if (tokens.refresh_token) {
    jar.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...baseOptions(),
      maxAge: REFRESH_MAX_AGE,
    });
  }
  if (tokens.expiry_date) {
    jar.set(EXPIRY_COOKIE, String(tokens.expiry_date), {
      ...baseOptions(),
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export function clearTokenCookies(jar: CookieJar) {
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(EXPIRY_COOKIE);
}
