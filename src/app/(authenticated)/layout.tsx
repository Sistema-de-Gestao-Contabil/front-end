"use client";
import "../../styles/globals.css";
// import type { Metadata } from 'next';
import { Inter } from "next/font/google";

import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/SideNav";
import Header from "@/components/Header";
import HeaderMobile from "@/components/MobileHeader";
import { usePathname } from "next/navigation";
import { checkIsPublicRoute } from "@/functions/check-is-public-route";
import PrivateRoutes from "@/components/PrivateRoutes";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'Gestão Contábil',
//   description: 'Sistema de gestão contábil',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const ispublic = checkIsPublicRoute(pathName);
  console.log("ispublic", ispublic);

  return (
    // <>
      <html lang="en">
        <body className={`bg-white${inter.className}`}>
          <div className="flex">
            <SideNav />
            <main className="flex-1">
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>
                  {/* {ispublic && children} */}
                  {children}
                  {/* {!ispublic && <PrivateRoutes>{children}</PrivateRoutes>} */}
                </PageWrapper>
              </MarginWidthWrapper>
            </main>
          </div>
        </body>
      </html>
    // </>
  );
}
