import type { Metadata } from "next";
import AccentButton from "@/components/accentButton";
import "./globals.css";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Roboto } from "next/font/google"
import styles from "./layout.module.css"
import PageContent from "@/components/pageContent";

export const metadata: Metadata = {
  title: "Tiuku",
  description: "Tiuku",
};

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className} data-scroll-behavior="smooth">
      <body className={styles.body}>
        <div>
          <NavBar>
            <Link href="/new">
              <AccentButton>
                New Poll
              </AccentButton>
            </Link>
          </NavBar>
          <PageContent>
            {children}
          </PageContent>
        </div>
        <Footer />
      </body>
    </html>
  );
}
