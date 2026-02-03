import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";

// Clean, modern sans-serif for body text
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Porsche-inspired geometric sans-serif for headings
// Archivo has the same clean, precise, engineering feel as Porsche Next
const archivo = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
        className={`${inter.variable} ${archivo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
