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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>();
  const [data, setData] = useState<{ expense: []; revenue: []; info: any }>({
    expense: [],
    revenue: [],
    info: {},
  });

  useEffect(() => {
    useApi("get", "transactions/graphic-data/1").then((res) => {
      setData({ expense: res.expense, revenue: res.expense, info: res.info });
    });
  }, []);

  // if (data) {
  //   const labelsBar = data.revenue.map((item: any) => item.categoryName);
  //   const percentagesBar = data.revenue.map((item: any) => item.percentage);
  //   const totalSpent = data.expense.map((item: any) => item.totalSpent);
  // }

  // console.log(labelsLine, percentagesLine);
  async function handleDownloadPDF(type: string) {
    try {
      const response = await endPoint.get(`report/1?type=${type}`, {
        responseType: "blob",
      });

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
    // } catch (error: any) {
    //   console.error("Erro ao baixar o PDF:", error.response.data.message);
    // }
  }

  const showAlert = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 1550);
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
          "#6E84FF", // Uma cor análoga
          "#8093FF", // Outra cor análoga
          "#91A5FF",
          "#CFD5FA",
        ],
        borderWidth: 2,
        hoverOffset: 4,
        totalSpent: data.revenue.map((item: any) => item.totalSpent),
      },
    ],
  };

  console.log(data.info);

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
        display: true, // Oculta a legenda
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
          value={`R$${data.info.cashBalance}`}
          iconName="tabler:flag-dollar"
        />
        <CardIcon
          name="Saidas mensais"
          value={`R$${data.info.countExpense}`}
          iconName="streamline:subscription-cashflow"
        />
        <CardIcon
          name="Entradas mensais"
          value={`R$${data.info.countRevenue}`}
          iconName="bi:graph-down"
        />
        <CardIcon
          name="ganhos totais"
          value={`R$${data.info.totalRevenue ? data.info.totalRevenue : "0.00"}`}
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
      {error && <Alert message={error} type="error" />}
    </>
  );
}
