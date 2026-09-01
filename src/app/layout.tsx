import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DeepWork — a quiet place to do focused work",
    template: "%s · DeepWork",
  },
  description:
    "Pick a session length, start the timer, and bank the time. DeepWork tracks focused hours without turning your attention into a scoreboard.",
  openGraph: {
    title: "DeepWork — a quiet place to do focused work",
    description:
      "Pick a session length, start the timer, and bank the time. DeepWork tracks focused hours without turning your attention into a scoreboard.",
    siteName: "DeepWork",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepWork — a quiet place to do focused work",
    description:
      "Pick a session length, start the timer, and bank the time.",
  },
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
        {children}
      </body>
    </html>
  );
}
