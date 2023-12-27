"use client";
import React, { ComponentProps } from "react";
export type TableProps = ComponentProps<"table"> & {
  thOptions: string[];
  checkbox: boolean;
};

export default function Table({
  thOptions,
  checkbox = false,
  ...props
}: TableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {thOptions.map((item) => (
                <th
                  key={item}
                  scope="col"
                  className="px-4 py-3.5 text-sm justify-center font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            {props.children}
          </tbody>
        </table>
      </div>
    </>
  );
}
