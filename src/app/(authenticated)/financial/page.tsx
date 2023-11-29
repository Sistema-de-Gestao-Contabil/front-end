'use client'
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Select, { OptionProps } from "@/components/Select";
import Button from "@/components/Button";
import { useApi } from "@/hooks/useApi";


export default function Despesas() {
  const [categorys, setCategorys] = useState<OptionProps[]>([
    {
      id: 1,
      name: 'Aluguel'
    },
    {
      id: 2,
      name: 'Equipamentos'
    },
    {
      id: 3,
      name: 'Supermercado'
    },
    {
      id: 4,
      name: 'Alimentação'
    },
    {
      id: 5,
      name: 'Água'
    },
    {
      id: 6,
      name: 'Internet'
    },
    {
      id: 7,
      name: 'Salário'
    },
    {
      id: 8,
      name: 'Cartão de crédito'
    },
    {
      id: 9,
      name: 'Energia'
    },
  ])
  const companys = [
    {
      id: 1,
      name: 'Empresa 1'
    }
  ]
  const [value, setValue] = useState<number>()
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('receita')
  const [status, setStatus] = useState<number>(0)
  const [categoryId, setCategoryId] = useState<number>(categorys[0].id)
  const [companyId, setCompanyId] = useState<number>(companys[0].id)


  const findAllTransactions = async () => {
    const response = await useApi('get', 'transactions/')
    console.log(response);
    
    
  }

  const createTransaction = async (e:any) => {
    e.preventDefault()
    const dados = {
      value,
      description,
      date,
      type,
      status,
      categoryId,
      companyId
    }
    console.log(dados);
    

    const response = await useApi('post', 'transactions', dados)

    if(response){
      alert('Transação cadastrada com sucesso')
      setValue(undefined)
      setDescription('')
      setDate('')
    }
    
  }
  
  useEffect(() => {
    findAllTransactions()
  }, [])
  

  return (
    <>
      <Heading title="Despesas" subtitle="Cadastro de despesas e receitas"/>

      <div style={{
        display:'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <form className="flex flex-col w-full p-4 max-w-[600px]">
          <label htmlFor="value" className="text-[#444557]">Valor</label>
          <Input 
          name="value" 
          className="pl-3 mb-8 w-full"  
          placeholder="Informe o valor" 
          type="number" 
          onChange={(e) => setValue(Number(e.target.value))}
          />

          <label htmlFor="description" className="text-[#444557]">Descrição</label>
          <Input 
          name="description" 
          className="pl-3 mb-8 w-full" 
          placeholder="Informe uma descrição" 
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="date" className="text-[#444557]">Data</label>
          <Input 
          name="date" 
          className="pl-3 text-gray-400 mb-8 w-full" 
          placeholder="Informe uma data" 
          type="date"
          onChange={(e) => setDate(e.target.value)}
          />

          <label htmlFor="type" className="text-[#444557]">Tipo</label>
          <Select 
          name="type" 
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
          onChange={(e) => setType(e.target.value === '1' ? 'receita' : 'despesa')}
          />

          <label htmlFor="status" className="text-[#444557]">Status</label>
          <Select 
          name="status" 
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
          onChange={(e) => setStatus(Number(e.target.value))}
          />

          <label htmlFor="category" className="text-[#444557]">Categoria</label>
          <Select 
          name="category" 
          className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-gray-400 pl-3" 
          options={categorys}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          />

          <label htmlFor="company" className="text-[#444557]">Empresa</label>
          <Select 
          name="company" 
          className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-gray-400 pl-3" 
          options={companys}
          onChange={(e) => setCompanyId(Number(e.target.value))}
          />

          <Button className="m-auto" onClick={(e) => createTransaction(e)}>Cadastrar</Button>
        </form>
      </div>
    </>
  );
}