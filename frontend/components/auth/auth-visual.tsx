import Image from "next/image";

export function AuthVisual() {
  return (
    <aside className="sticky top-0 hidden h-svh overflow-hidden bg-black text-white lg:flex lg:flex-col lg:justify-end">
      <Image
        src="/auth-movie-collage.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 53vw, 0px"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20"
      />
      <div className="relative z-10 mb-12 max-w-xl space-y-5 p-10 xl:p-14">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
          Discover movies and share your ideas.
        </h2>
      </div>
    </aside>
  );
}
