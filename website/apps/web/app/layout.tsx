import type { Metadata } from "next";
import "@workspace/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "DragonBears MC Logs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
