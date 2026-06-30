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

  if (!response.ok) {
    throw new Error("Failed to fetch user by clerk id");
  }

  const fetchUser: User = await response.json();
  return fetchUser;
}
