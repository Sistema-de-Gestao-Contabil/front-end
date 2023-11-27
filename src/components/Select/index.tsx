/* eslint-disable react/jsx-key */
import React, { ComponentProps } from "react";

export interface OptionProps {
  id: number;
  name: string;
}

export type SelectProps = ComponentProps<"select"> & {
  options: OptionProps[];
};

export default function Select({ options, ...props }: SelectProps) {
  return (
    <>
      <select {...props}>
        {options.map((item: OptionProps) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </>
  );
}
