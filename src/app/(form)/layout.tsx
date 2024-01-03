import "../../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/SideNav";
import Header from "@/components/Header";
import HeaderMobile from "@/components/MobileHeader";
import { twMerge } from "tailwind-merge";
import SideBarForm from "@/components/SideBarForm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão Contábil",
  description: "Sistema de gestão contábil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white${inter.className}`}>
        <div className="flex">
          <SideBarForm />
          <main className="flex-1">
            <div
              className={twMerge(
                "flex flex-col md:ml-[33.3%] sm:border-r sm:border-zinc-700 min-h-screen"
              )}
            >
              <Header />
              <HeaderMobile />
              <PageWrapper>{children}</PageWrapper>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
