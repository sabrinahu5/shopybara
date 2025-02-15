import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./ui/fonts";
import NavBar from "./ui/NavBarAndFooter/NavBar";
import Footer from "./ui/NavBarAndFooter/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "shopybara",
  description:
    "Discover and shop furniture that matches your Spotify inspiration, powered by AI that understands your style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <NavBar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
