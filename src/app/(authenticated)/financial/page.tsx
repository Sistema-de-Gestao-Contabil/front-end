'use client'
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Select, { OptionProps } from "@/components/Select";
import Button from "@/components/Button";
import { useApi } from "@/hooks/useApi";
import { useForm  } from "react-hook-form";
import SelectCategorys from "@/components/SelectCategorys";


export default function Despesas() {
  const { register, handleSubmit, formState: {errors} } = useForm()
  const [categorys, setCategorys] = useState<object[]>([])
  
  const companys = [
    {
      id: 1,
      name: 'Empresa 1'
    },
    {
      id: 1,
      name: 'Empresa 1'
    },
    {
      id: 1,
      name: 'Empresa 1'
    },
    {
      id: 1,
      name: 'Empresa 1'
    },
    {
      id: 1,
      name: 'Empresa 1'
    },
    {
      id: 1,
      name: 'Empresa 1'
    },
  ]

  const [output, setOutput] = useState('')


  const createTransaction = (data:any) => {
    console.log(data);
    setOutput(JSON.stringify(data, null, 2))
    
  }

  return (
    <>
      <Heading title="Despesas" subtitle="Cadastro de despesas e receitas"/>

      <div style={{
        display:'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>

        <form className="flex flex-col w-full p-4 max-w-[600px]">
          <label htmlFor="value" className="text-[#444557]">Valor</label>
          <Input 
            className="pl-3 mb-8 w-full"  
            placeholder="Informe o valor" 
            type="number" 
            {...register('value')}
          />

          <label htmlFor="description" className="text-[#444557]">Descrição</label>
          <Input 
            className="pl-3 mb-8 w-full" 
            placeholder="Informe uma descrição" 
            type="text"
            {...register("description")}
          />

          <label htmlFor="category" className="text-[#444557]">Categoria</label>
          <SelectCategorys
            options={categorys}
            {...register('categoryId')}
          />

          <label htmlFor="company" className="text-[#444557]">Empresa</label>
          <Select 
            className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-gray-400 pl-3" 
            options={companys}
            {...register('companyId')}
          />

          <label htmlFor="date" className="text-[#444557]">Data</label>
          <Input 
            className="pl-3 text-gray-400 mb-8 w-full" 
            placeholder="Informe uma data" 
            type="date"
            {...register('date')}
          />

          <label htmlFor="type" className="text-[#444557]">Tipo</label>
          <Select 
            className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-gray-400 pl-3" 
            options={[
              {
                id: 1,
                name: 'Receita'
              },
              {
                id: 2,
                name: 'Despesa'
              }
            ]}
            {...register('type')}
          />

          <label htmlFor="status" className="text-[#444557]">Status</label>
          <Select 
            className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-gray-400 pl-3" 
            options={[
              {
                id: 0,
                name: 'Não Pago'
              },
              {
                id: 1,
                name: 'Pago'
              }
            ]}
            {...register('status')}
          />

          <Button className="m-auto" type="button" onClick={handleSubmit(createTransaction)}>Cadastrar</Button>
        </form>

        <div>
          {output}
        </div>
      </div>
    </>
  );
}