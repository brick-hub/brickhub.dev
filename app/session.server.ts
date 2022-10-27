import { decodeJwt } from "jose";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Credentials, User } from "./brickhub.server";
import { refresh } from "./brickhub.server";

interface Tokens extends Credentials {
  headers?: Record<string, string>;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(
  credentials: Credentials,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("__credentials__", JSON.stringify(credentials));
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export function isExpired(credentials: Credentials): boolean {
  return (
    !credentials.expires ||
    credentials.expires <= new Date().getTime() + 1000 * 60 * 1
  );
}

export async function getTokens(request: Request): Promise<Tokens | null> {
  const session = await getUserSession(request);
  const value = session.get("__credentials__");
  if (!value || typeof value !== "string") return null;
  let credentials: Credentials = JSON.parse(value);
  let headers: Record<string, string> | undefined;
  if (isExpired(credentials)) {
    try {
      credentials = await refresh({ token: credentials.refreshToken });
      headers = { "Set-Cookie": await commitSession(credentials) };
    } catch (_) {
      return null;
    }
  }
  return { ...credentials, headers };
}

export function decodeUser(token: string): User {
  const claims = decodeJwt(token);
  const email = claims["email"] as string;
  const emailVerified = Boolean(claims["email_verified"]);
  const id = claims["user_id"] as string;
  const user: User = {
    id,
    email,
    emailVerified,
  };
  return user;
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const value = session.get("__credentials__");
  if (!value || typeof value !== "string") return null;
  const credentials: Credentials = JSON.parse(value);
  return decodeUser(credentials.accessToken);
}

export async function destroySession(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

async function commitSession(credentials: Credentials): Promise<string> {
  const session = await storage.getSession();
  session.set("__credentials__", JSON.stringify(credentials));
  return storage.commitSession(session);
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
