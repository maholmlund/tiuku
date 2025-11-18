import type { Metadata } from "next";
import AccentButton from "@/components/accentButton";
import "./globals.css";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

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
      <body>
        <NavBar>
          <Link href="/new">
            <AccentButton>
              New Poll
            </AccentButton>
          </Link>
        </NavBar>
        {children}
        <Footer />
      </body>
    </html>
  );
}
