"use client";

import React from "react";

import Image from "next/image";
import { Icon } from "@iconify/react";

import user from "@/assets/user.jpeg";
import logo from "@/assets/logo.svg";

import Input from "../Input";

export type HeadingProps = {
  title?: string;
  subtitle?: string;
};

export default function Heading({ title, subtitle }: HeadingProps) {
  return (
    <>
      <div className="flex justify-between w-full ">
        {!title && (
          <div className="md:flex hidden items-center font-bold gap-3">
            <Image
              priority
              src={logo}
              alt="logotipo"
              width={40}
              height={40}
              style={{ borderRadius: 56 }}
            />
            SemNome
          </div>
        )}

        <div>
          <p className="text-2xl font-semibold text-[#444557]  font-sans">
            {title}
          </p>
          <p className="text-gray-400 text-base font-medium font-sans">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {subtitle == "Dashboard" && <Input placeholder="Buscar" className="w-96" />}

          <div className="flex gap-5 items-center">
            <Icon icon="mingcute:notification-fill" width="24" height="24" />
            <Image
              priority
              src={user}
              alt="profilePicture"
              width={40}
              height={40}
              style={{ borderRadius: 56 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
