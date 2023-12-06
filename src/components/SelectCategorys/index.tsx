/* eslint-disable react/jsx-key */
import React, { ComponentProps, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useApi } from "@/hooks/useApi";
import Input from "../Input";


export interface OptionProps {
  id: number;
  name: string;
}

export type SelectProps = ComponentProps<"select"> & {
  options: object[];
};

export default function SelectCategorys({ options, ...props }: SelectProps) {
    const [categorys, setCategorys] = useState<object[]>([])
    const [showInputs, setShowInputs] = useState(false) 

  const findAllCategorys = async () => {
    const response = await useApi('get', 'categorys')
    console.log(response);
    setCategorys(response.result)
    
  }

  useEffect(() => {
    findAllCategorys()
  },[])

  return (
    <>
      <div className="flex items-center justify-center h-10 mb-8">
        <select {...props} className="h-full w-[80%] bg-[#F5F5FE] text-[#9A9AA2] rounded-xl outline-none border-none ring-1 ring-gray-100 focus:ring-gray-600">
            {categorys.map((item:any) => (
            <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>

        <button 
            className={twMerge("flex items-center w-[20%] h-full justify-center bg-[#F5F5FE] hover:bg-[#e6e6ee] border-2 border-blue-600 text-blue-600 font-bold p-2 rounded-lg",)}
            onClick={() => {setShowInputs(!showInputs)}}
            type="button"
        >
            Adicionar
        </button>

      </div>

      {
        showInputs
        &&
        <div className="mb-8">
          <label htmlFor="nameCategory" className="text-[#444557]">Nome da Categoria</label>
          <Input placeholder="Informe o nome da categoria" className="h-10 w-full bg-[#F5F5FE] text-[#9A9AA2] rounded-xl outline-none border-none ring-1 ring-gray-100 focus:ring-gray-600 pl-3"/>
        </div>     
      }
      
    </>
  );
}
