import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SyncClerkUser } from "@/components/auth/sync-clerk-user";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SyncClerkUser />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
