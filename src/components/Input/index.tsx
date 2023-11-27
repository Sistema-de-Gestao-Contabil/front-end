import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = ComponentProps<"input"> & {
  icon?: boolean;
};
export default function Input({ icon = false , className, ...props }: InputProps) {
  return (
    <>
      <input
        className={twMerge(
          "h-10 w-96 bg-[#F5F5FE] rounded-xl border-none ring-1 ring-gray-100 focus:ring-gray-600",
          className
        )}
        {...props}
      />
    </>
  );
}
