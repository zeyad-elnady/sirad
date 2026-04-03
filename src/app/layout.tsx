import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sirad | Kinetic Precision Tech Agency",
  description: "Uniting technical excellence with captivating design to propel your business forward.",
};

// This root layout is intentionally minimal.
// The <html> and <body> tags are fully controlled by src/app/[locale]/layout.tsx
// which sets lang, dir, and fonts per locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
