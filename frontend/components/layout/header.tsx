import Link from "next/link";
import { Search } from "lucide-react";
import { Pacifico } from "next/font/google";
import { AuthControls } from "../auth/auth-controls";
import { NavLink } from "./nav-link";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Favorites", href: "/favorites", requiresAuth: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-2">
        {/* Logo */}
        <Link href="/" className={`${pacifico.className} text-2xl`}>
          MovieDB
        </Link>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              className="h-10 w-full rounded-full border bg-background pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* Navigation & Avatar */}
        <div className="flex items-center justify-end gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                requiresAuth={link.requiresAuth}
              />
            ))}
          </nav>

          <AuthControls />
        </div>
      </div>
    </header>
  );
}
