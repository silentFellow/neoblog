import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neoblog",
  description: "Neoblog is a modern, simple, yet powerful blog site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} h-screen min-w-screen max-w-7xl mx-auto p-9 max-sm:p-6`}
      >
        {children}
        <Toaster expand={false} />
      </body>
    </html>
  );
}
