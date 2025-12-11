import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Cohort | Build the Future Together",
  description: "Cohort is on a mission to bring together the most talented individuals to create extraordinary things. Join our community and start building the future.",
  keywords: ["cohort", "community", "talent", "innovation", "creative"],
  openGraph: {
    title: "Cohort | Build the Future Together",
    description: "Join the most talented community building the future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}

