import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { Shell } from "@/components/shell";
export const metadata: Metadata = {
  title: "EcoRecommend AI — Thoughtful shopping, explained",
  description:
    "Discover products with transparent recommendations, sustainability evidence and honest explanations.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
