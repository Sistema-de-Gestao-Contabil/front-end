"use client";

import { Icon } from "@iconify/react";
import React, { ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = ComponentProps<"button"> & {
  outline?: boolean;
  iconName?: string;
};

export default function Button({
  outline = false,
  iconName,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{ borderWidth: 1 }}
      data-outline={outline}
      className={twMerge(
        "flex items-center w-40 h-10 justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg data-[outline=true]:bg-white data-[outline=true]:border-[0.5px] data-[outline=true]:hover:bg-zinc-200 data-[outline=true]:border-stone-300 data-[outline=true]:text-blue-600",
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        {iconName ? <Icon icon={iconName} width="20" height="20" /> : null}
        {props.children}
      </div>
    </button>
  );
}
