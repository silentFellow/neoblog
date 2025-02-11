import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import Provider from "@/components/shared/Provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neoblog",
  description: "Neoblog is a modern, simple, yet powerful blog site.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider session={session}>
          <main className="h-screen max-h-screen w-screen max-w-7xl mx-auto p-9 max-sm:p-6 overflow-auto">
            {children}
            <Toaster expand={false} />
          </main>
        </Provider>
      </body>
    </html>
  );
}
