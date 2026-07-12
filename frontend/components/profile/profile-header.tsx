import Image from "next/image";
import type { User } from "@/types/user";

type ProfileHeaderProps = {
  user: User;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="flex flex-col items-center text-center bg-zinc-900 rounded-3xl py-6">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={96}
            height={96}
            className="mb-4 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mb-4 h-24 w-24 rounded-full bg-zinc-700" />
        )}
        <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
      </div>
    </section>
  );
}
