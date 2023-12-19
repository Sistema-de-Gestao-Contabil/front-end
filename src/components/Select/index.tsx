/* eslint-disable react/display-name */
import React, { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface OptionProps {
  id: number;
  name: string;
}

export type SelectProps = ComponentProps<"select"> & {
  options: OptionProps[];
  label?: string;
};


const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, label, ...props }, ref) => {
    return (
      <>
        <label className="flex gap-1 mt-5">{label}</label>
        <select
          ref={ref}
          {...props}
          className={twMerge(
            "h-10 w-full px-3 bg-[#F5F5FE] text-gray-600 rounded-md border-none ring-1  outline-none  ring-gray-100 focus:ring-gray-200",
            className
          )}
        >
          {options.map((item: OptionProps) => (
            <option key={item.id} value={item.id} className="text-gray-600 ">
              {item.name}
            </option>
          ))}
        </select>
      </>
    );
  }
);
export default Select;
