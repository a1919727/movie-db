import { AuthHeader } from "@/components/auth/auth-header";
import { AuthVisual } from "@/components/auth/auth-visual";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-background font-[family-name:var(--font-geist-sans)] text-foreground">
      <AuthHeader />
      <main className="grid lg:grid-cols-[1.1fr_1fr]">
        <AuthVisual />

        <div className="flex min-w-0 flex-col pt-11">
          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-12 xl:px-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
