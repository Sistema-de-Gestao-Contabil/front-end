"use client";

import React from "react";

import Image from "next/image";
import { Icon } from "@iconify/react";

import user from "@/assets/user.jpeg";
import Input from "../Input";
export default function Heading(props: {
  title: string;
  subtitle: string;
  inputPlaceholder?: boolean;
}) {
  return (
    <>
      <div className="flex justify-between w-full ">
        <div>
          <p className="text-2xl font-semibold text-[#444557]  font-sans">
            {props.title}
          </p>
          <p className="text-gray-400 text-base font-medium font-sans">
            {props.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {props.inputPlaceholder && (
            <Input placeholder="Buscar" />
          )}

          <div className="flex gap-2 ">
            <Icon icon="mingcute:notification-fill" width="24" height="24" />,
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
