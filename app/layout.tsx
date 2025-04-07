import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavHeader } from "@/components/global/NavHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Not A Ghostwriter",
  description: "Generate professional content tailored to your writing style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavHeader />
        <main>{children}</main>
        <footer className="border-t border-primary text-primary">
          <div className="container mx-auto px-4 py-6 text-center text-sm">
            Not A Ghostwriter © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
