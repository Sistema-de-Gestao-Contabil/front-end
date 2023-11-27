"use client";

import React from "react";
import Image from "next/image";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

import logo from "@/assets/logo.svg";
import profilePicture from "@/assets/user.jpeg";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          " border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4 md:hidden">

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <Image
              priority
              src={logo}
              alt="Follow us on Twitter"
              width={40}
              height={40}
            />
            <span className="font-bold text-xl flex">Sem Nome</span>
          </Link>
        </div>

        {/* <div className="hidden md:block">
          <Image
            priority
            src={profilePicture}
            alt="Follow us on Twitter"
            width={30}
            height={30}
            style={{ borderRadius: 60 }}
          /> */}
          {/* <div className="h-8 w-8 rounded-full bg-[#2F3044] flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Header;
