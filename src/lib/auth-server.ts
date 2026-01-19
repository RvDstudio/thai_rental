import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const headersList = await headers();
  return auth.api.getSession({
    headers: headersList,
  });
}

export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === "admin";
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    return { authorized: false, reason: "not_authenticated" as const };
  }
  if (session.user.role !== "admin") {
    return { authorized: false, reason: "not_admin" as const };
  }
  return { authorized: true, user: session.user };
}
