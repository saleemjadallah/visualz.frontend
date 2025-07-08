import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "../styles/cultural-themes.css";
import { CulturalThemeProvider } from "@/components/cultural/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display", 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignVisualz - AI-Powered Event Design",
  description: "Create stunning, culturally-aware event designs using AI that understands traditions, aesthetics, and the art of beautiful celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased font-body`}
      >
        <CulturalThemeProvider defaultTheme="japanese" enableTransitions={true}>
          {children}
        </CulturalThemeProvider>
      </body>
    </html>
  );
}
