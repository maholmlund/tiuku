import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AccentButton from "@/components/accentButton";
import "./globals.css";
import NavBar from "@/components/navbar";
import Link from "next/link";

const roboto = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiuku",
  description: "Tiuku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <NavBar>
          <Link href="/new">
            <AccentButton>
              New Poll
            </AccentButton>
          </Link>
        </NavBar>
        {children}
      </body>
    </html>
  );
}
