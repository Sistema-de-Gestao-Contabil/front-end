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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>();
  const [data, setData] = useState<{ expense: []; revenue: []; info: any }>({
    expense: [],
    revenue: [],
    info: {},
  });
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
    useApi("get", "transactions/graphic-data/1").then((res) => {
      setData({ expense: res.expense, revenue: res.revenue, info: res.info });
    });
  }, []);

  async function handleDownloadPDF(type: string) {
    try {
      const response = await endPoint.get(
        `transactions/generate-pdf/1?type=${type}`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200 || response.status === 201) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `relatorio(${new Date().toLocaleDateString()}).pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      showAlert(
        `Não há nenhuma transação ${type == "monthly" ? "mensal" : "diaria"}`
      );
      console.error("Error downloading report:", error);
    }
  }

  const showAlert = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const chartData = {
    labels: data.expense.map((item: any) => item.categoryName),
    datasets: [
      {
        label: "despesas por categoria",
        data: data.expense.map((item: any) => item.percentage),
        borderColor: "#6174EE",
        borderWidth: 2,
        backgroundColor: "#CFD5FA90",
        fill: true,
        totalSpent: data.expense.map((item: any) => item.totalSpent),
      },
    ],
  };

  const chartBarData = {
    labels: data.revenue.map((item: any) => item.categoryName),
    datasets: [
      {
        label: "receitas por categoria",

        data: data.revenue.map((item: any) => item.percentage),
        backgroundColor: [
          "#6174EE",
          "#6E84FF",
          "#8093FF",
          "#91A5FF",
          "#CFD5FA",
        ],
        borderWidth: 2,
        hoverOffset: 4,
        totalSpent: data.revenue.map((item: any) => item.totalSpent),
      },
    ],
  };


  const customLineOptions = {
    scales: {
      x: { type: "category" as const },
      y: { beginAtZero: true },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const totalSpent = context.dataset.totalSpent[context.dataIndex];
            return `Valor gasto: ${totalSpent}`;
          },
        },
      },
    },
  };

  const customDoughnutOptions = {
    scales: {
      x: { type: "category" as const },
      y: { beginAtZero: true },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const totalSpent = context.dataset.totalSpent[context.dataIndex];
            return `Valor gasto: ${totalSpent}`;
          },
        },
      },
    },
  };
  return (
    <>
      <Heading title="Bem vindo, Admin" subtitle="Dashboard" />

      <div className="flex justify-between my-3">
        <CardIcon
          name="Saldo Atual"
          value={data.info.cashBalance}
          iconName="tabler:flag-dollar"
        />
        <CardIcon
          name="Saidas mensais"
          value={data.info.countExpense}
          iconName="streamline:subscription-cashflow"
        />
        <CardIcon
          name="Entradas mensais"
          value={data.info.countRevenue}
          iconName="bi:graph-down"
        />
        <CardIcon
          name="ganhos totais"
          value={data.info.totalRevenue ? data.info.totalRevenue : 0.0}
          iconName="tabler:flag-dollar"
        />
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-lg">Estatisticas gerais</span>
        <div>
          <Button
            outline
            className="border-none  w-44"
            onClick={() => setIsOpen(!isOpen)}
            iconName="material-symbols:download"
          >
            Baixar relatório
          </Button>

          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 mr-10">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div
                  onClick={() => handleDownloadPDF("daily")}
                  className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  role="menuitem"
                >
                  Relatório diario
                </div>
                <div
                  onClick={() => handleDownloadPDF("monthly")}
                  className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  role="menuitem"
                >
                  Relatório mensal
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div style={{ width: "500px", height: "250px" }}>
          <Line data={chartData} options={customLineOptions} />
        </div>
        <div style={{ width: "500px", height: "250" }}>
          <Bar data={chartBarData} options={customDoughnutOptions} />
        </div>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-lg">Transações</span>
      </div>

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

        <div className="max-h-[500px] bg-zinc-700 overflow-y-scroll">
          
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

      {error && <Alert message={error} type="error" />}
    </>
  );
}
