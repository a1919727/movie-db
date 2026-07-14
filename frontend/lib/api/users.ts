import type { User } from "../../types/user";
import { fetchFromApi, getErrorMessage } from "./client";

export async function createUser(payload: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  clerkUserId: string;
}) {
  const response = await fetchFromApi("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to create user"));
  }

  const createdUser: User = await response.json();
  return createdUser;
}

export async function getUserByClerkId(clerkUserId: string) {
  const response = await fetchFromApi(`/users/clerk/${clerkUserId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to fetch user by clerk id"),
    );
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
  const response = await fetchFromApi("/users/sync", {
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
    throw new Error(await getErrorMessage(response, "Failed to sync user"));
  }

  const syncedUser: User = await response.json();
  return syncedUser;
}

export async function updateUserProfile(
  userId: number,
  payload: {
    name: string;
    avatar?: File | null;
  },
) {
  const formData = new FormData();
  formData.set("name", payload.name);
  if (payload.avatar) {
    formData.set("avatar", payload.avatar);
  }

  const response = await fetchFromApi(`/users/${userId}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to update profile"));
  }

  const updatedUser: User = await response.json();
  return updatedUser;
}

export async function addFavorite(
  userId: number,
  payload: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    posterUrl: string;
    description: string;
    genres: string[];
  },
) {
  const response = await fetchFromApi(`/users/${userId}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to add favorite"));
  }
  return response.json();
}

export async function deleteFavorite(userId: number, tmdbMovieId: number) {
  const response = await fetchFromApi(
    `/users/${userId}/favorites/${tmdbMovieId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to delete favorite"),
    );
  }
}

export async function addWatched(
  userId: number,
  payload: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    posterUrl: string;
    description: string;
  },
) {
  const response = await fetchFromApi(`/users/${userId}/watched`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to add watched movie"),
    );
  }

  return response.json();
}
