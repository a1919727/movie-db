import type { User } from "../../types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export async function createUser(payload: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  clerkUserId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const createdUser: User = await response.json();
  return createdUser;
}

export async function getUserByClerkId(clerkUserId: string) {
  const response = await fetch(`${API_BASE_URL}/users/clerk/${clerkUserId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user by clerk id");
  }

  const fetchUser: User = await response.json();
  return fetchUser;
}

export async function syncClerkUser(payload: {
  clerkUserId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const response = await fetch(`${API_BASE_URL}/users/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clerkUserId: payload.clerkUserId,
      email: payload.email,
      name: payload.name?.trim() || payload.email.split("@")[0] || "User",
      avatarUrl: payload.avatarUrl,
    }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(errorBody?.message || "Failed to sync user");
  }

  const syncedUser: User = await response.json();
  return syncedUser;
}
