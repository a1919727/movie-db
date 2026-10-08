import Link from "next/link";
import { Pacifico } from "next/font/google";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export function AuthHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between pl-6 sm:pl-10 lg:top-10 xl:top-14 xl:pl-14">
      <Link
        href="/"
        className={`${pacifico.className} inline-flex h-11 items-center rounded-sm text-2xl text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:text-3xl lg:text-white lg:focus-visible:ring-white`}
      >
        MovieDB
      </Link>
      <ThemeToggle />
    </header>
  );
}
