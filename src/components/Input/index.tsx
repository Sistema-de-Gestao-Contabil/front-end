/* eslint-disable react/display-name */
import React, { ComponentProps, ForwardedRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = ComponentProps<"input"> & {
  label?: string;
  icon?: boolean;
  mandatory?: boolean;
  error?: string;
};
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, icon = false, mandatory = false, error , className, ...props },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label className="flex gap-1 mt-5">
            {label}{" "}
            {mandatory && error &&(
              <span className="font-semibold  text-red-500">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            "peer h-10 w-full py-2 px-3 bg-[#F5F5FE] text-[#444557] placeholder-[#9A9AA2] outline-none rounded-xl border-none ring-1 ring-gray-100 focus:ring-gray-200",
            className
          )}
          {...props}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);

export default Input;
