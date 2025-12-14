import type { Metadata } from "next";
import { Inter, Red_Hat_Display } from "next/font/google"; // Assuming Inter was default or just add Red_Hat_Display
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const redHat = Red_Hat_Display({ 
  subsets: ["latin"],
  variable: "--font-redhat" 
});

export const metadata: Metadata = {
  title: "Cohorts.team | More for less",
  description: "Cohort is on a mission to bring together the most talented individuals to create extraordinary things. Join our community and start building the future.",
  keywords: ["cohort", "community", "talent", "innovation", "creative"],
  openGraph: {
    title: "Cohorts.team | More for less",
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
      <body className={redHat.variable}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}

