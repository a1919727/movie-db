import Link from "next/link";
import { Pacifico } from "next/font/google";
import { AuthControls } from "../auth/auth-controls";
import { NavLink } from "./nav-link";
import { SearchForm } from "./search-form";
import { ThemeToggle } from "./theme-toggle";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "My Library", href: "/favorites", requiresAuth: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="mx-auto grid min-h-16 max-w-[1440px] grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 px-4 py-5 lg:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link href="/" className={`${pacifico.className} text-2xl`}>
          MovieDB
        </Link>

        <nav className="col-span-2 row-start-2 flex items-center justify-center gap-8 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:gap-14">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                requiresAuth={link.requiresAuth}
              />
            ))}
        </nav>

        <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-1 sm:gap-2 lg:col-start-3">
          <SearchForm />
          <ThemeToggle />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
