import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

// Clean, modern sans-serif for body text
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Elegant serif for headings - adds personality & warmth
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ibraheem Shaikh | Software Engineer",
  description: "Software Engineer & CS Student - Building bold, creative solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
