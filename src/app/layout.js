import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/Store";
import Link from "next/link";
import Menu from "@/components/Menu";
import SessionWrapper from "@/components/SessionWrapper";
import SearchBox from "@/components/SearchBox";
import CategoryNav from "@/components/CategoryNav"; // 1. IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My E-Commerce App",
  description: "A modern e-commerce platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <StoreProvider>
            <div className="flex min-h-screen flex-col justify-between">
              <header>
                <nav className="flex h-16 items-center px-6 justify-between shadow-md">
                  <Link href="/" className="text-lg font-bold">
                    E-Commerce
                  </Link>
                  <div className="hidden md:block flex-grow px-8">
                    <SearchBox />
                  </div>
                  <Menu />
                </nav>
                <CategoryNav /> {/* 2. ADD THE CATEGORY BAR HERE */}
              </header>
              <main className="container m-auto mt-4 px-4">{children}</main>
              <footer className="flex h-10 justify-center items-center shadow-inner">
                <p>Copyright © 2025 E-Commerce</p>
              </footer>
            </div>
          </StoreProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
