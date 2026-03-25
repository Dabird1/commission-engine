import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commission Engine | Infinity Home Services",
  description: "Interactive prototype demonstrating the Commission Engine for Infinity Home Services. Features 6 role-based experiences, gamification, what-if calculator, and Don't Make Me Think UX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
