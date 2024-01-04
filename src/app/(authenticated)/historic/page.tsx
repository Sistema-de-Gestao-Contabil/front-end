/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import CardIcon from "@/components/CardIcon";
import "chart.js/auto";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Button from "@/components/Button";
import {
  ChartOptions,
  CoreChartOptions,
  LineControllerChartOptions,
} from "chart.js/auto";
import { endPoint, useApi } from "@/hooks/useApi";
import Alert from "@/components/Alert";
import { Icon } from "@iconify/react";

export default function Historic() {
  const [transactions, setTransactions] = useState([])

  const findAllTransactions = async (queryString?:any) => {
    const response = await useApi('get', `transactions/?companyId=1${queryString ? '&&'+queryString : ''}`)
    //console.log(response);
    
    if (response.status == 200) {
      setTransactions(response.result)
    }
  }

  const removeTransaction = async (id:any) => {
    if(confirm('Tem certeza que deseja remove essa transação.')){
      const response = await useApi('delete', `transactions/?id=${id}&&companyId=1`)
      if(response.status == 200){
        alert('Transação removida com sucesso.')
        findAllTransactions()
      }
    }

  }

  useEffect(() => {
    findAllTransactions()
  }, []);

  return (
    <>
      <Heading title="Historico" subtitle="Historico de Transações" />

      <div>
        <p className="text-[#444557] mb-3">Filtrar por</p>
        <div className="flex justify-between gap-3 mb-8">

          <div className="w-1/4 flex items-center justify-center bg-[#F5F5FE] text-[#444557] rounded-xl border-none">

            <button
            onClick={(e:any) => {
              findAllTransactions(`dateFilter=recente`)
            }}  
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Mais Recente
            </button>

            <button 
            onClick={(e:any) => {
              findAllTransactions(`dateFilter=antigo`)
            }} 
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Mais Antigo
            </button>

          </div>

          <div className="w-1/4 flex items-center justify-center bg-[#F5F5FE] text-[#444557] rounded-xl border-none">
            <button
            onClick={(e) => {
              findAllTransactions(`valueFilter=alto`)
            }}  
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Valores mais altos primeiro
            </button>

            <button 
            onClick={(e:any) => {
              findAllTransactions(`valueFilter=baixo`)
            }} 
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Valores mais baixos primeiro
            </button>
          </div>

          <div className="w-1/4 flex items-center justify-center bg-[#F5F5FE] text-[#444557] rounded-xl border-none">
            <button
            onClick={(e:any) => {
              findAllTransactions(`statusFilter=1`)
            }}  
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Pago
            </button>

            <button 
            onClick={(e:any) => {
              findAllTransactions(`statusFilter=0`)
            }} 
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Não Pago
            </button>
          </div>

          <div className="w-1/4 flex items-center justify-center bg-[#F5F5FE] text-[#444557] rounded-xl border-none">
            <button
            onClick={(e:any) => {
              findAllTransactions(`typeFilter=receita`)
            }}  
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Receita
            </button>

            <button 
            onClick={(e:any) => {
              findAllTransactions(`typeFilter=despesa`)
            }} 
            className="bg-[#F5F5FE] hover:bg-gray-200 text-xs text-blue-600 font-bold py-2 px-4 rounded ml-2">
              Despesa
            </button>
          </div>

        </div>

        <div className="max-h-[700px] bg-zinc-700 overflow-y-scroll">
          
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
            <thead className="sticky top-0">
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4">Valor</th>
                <th className="py-2 px-4">Categoria</th>
                <th className="py-2 px-4">Tipo</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Data</th>
                <th className="py-2 px-4">Descrição</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>

            <tbody>

              {
                transactions.map((transaction:any) => 
                  <tr className="text-center border-4 text-gray-600">
                    <td className="py-2 px-4">R$ {transaction.value}</td>
                    <td className="py-2 px-4">{transaction.category.name}</td>
                    <td className="py-2 px-4">{transaction.type}</td>
                    <td className="py-2 px-4">{transaction.status ? 'Pago' : 'Não Pago'}</td>
                    <td className="py-2 px-4">{transaction.date}</td>
                    <td className="py-2 px-4">{transaction.description}</td>
                    <td className="py-2 px-4">
                      <button className="bg-[#F5F5FE] hover:bg-gray-200 text-blue-600 font-bold py-2 px-4 rounded ml-2" onClick={() => removeTransaction(transaction.id)}>
                        <Icon
                          className="text-gray-500 h-4 w-4 items-center justify-center transition-all m-auto"
                          icon="tabler:trash-filled"
                        />
                      </button>
                    </td>
                  </tr>
                )
              }

            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
