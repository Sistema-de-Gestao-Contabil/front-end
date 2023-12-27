"use client";
import React, { ComponentProps } from "react";
import { Icon } from "@iconify/react";
export type CardIconProps = ComponentProps<"div"> & {
  name: string;
  value: number;
  iconName: string;
};
export default function CardIcon({ name, value, iconName }: CardIconProps) {
  return (
    <div className="flex">
      <div className="w-16 h-16 rounded-lg bg-[#F5F5FE] flex items-center justify-center">
        <Icon
          className="text-blue-600 h-8 w-8 m-auto self-center"
          icon={iconName}
        />
      </div>

      <div className="ml-3 my-auto ">
        <h5>{value}</h5>
        <span className="text-stone-300">{name}</span>
      </div>
    </div>
  );
}
