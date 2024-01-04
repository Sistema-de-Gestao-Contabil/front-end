/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import CardIcon from "@/components/CardIcon";
import "chart.js/auto";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import Button from "@/components/Button";
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

  const storedToken = localStorage.getItem("token");
  const company = localStorage.getItem("companyId");
  const name = localStorage.getItem("name");

  console.log("00000000000", name);
  if (storedToken) {
    console.log("Token encontrado no localStorage:", storedToken, company);
  } else {
    console.log("Nenhum token encontrado no localStorage");
  }

  useEffect(() => {
    useApi("get", `transactions/graphic-data/${company}`).then((res) => {
      setData({ expense: res.expense, revenue: res.revenue, info: res.info });
      console.log({ data: res.revenue });
    });
  }, []);

  async function handleDownloadPDF(type: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado. Usuário não autenticado.");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await endPoint.get(
        `transactions/generate-pdf/1?type=${type}`,
        {
          responseType: "blob",
          headers,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `relatorio-${
          type === "monthly" ? "mensal" : "diário"
        }(${new Date().toLocaleDateString()}).pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      showAlert(
        `Não há nenhuma transação ${type === "monthly" ? "mensal" : "diária"}`
      );
      console.error("Erro ao baixar o relatório:", error);
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
    // labels: data.expense.map((item: any) => (
    //   <span
    //     key={item.categoryName}
    //     className="category-label"
    //     onClick={() => console.log(`Valor gasto para ${item.categoryName}: ${item.totalSpent}`)}
    //   >
    //     {item.categoryName}
    //   </span>
    // )),
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
    onClick: (_event: any, elements: any) => {
      if (elements && elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;

        // Acesse os dados do ponto clicado
        const clickedData = data.expense[clickedIndex];

        console.log("Point Clicked", clickedData, elements);

        // Adicione lógica adicional conforme necessário
      }
    },
  };

  const customBarOptions = {
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
            return `Valor Recebido: ${totalSpent}`;
          },
        },
      },
    },
  };
  return (
    <>
      <Heading title={`Bem vindo, ${name ? name : 'admin'}`} subtitle="Dashboard" />

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
          iconName="solar:money-bag-linear"
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
      <div>
        <div className="flex justify-between">
          <div style={{ width: "500px", height: "250px" }}>
            <Line data={chartData} options={customLineOptions} />
          </div>
          <div style={{ width: "500px", height: "250" }}>
            <Bar data={chartBarData} options={customBarOptions} />
          </div>
        </div>
        <div className="flex justify-between"></div>
        <span className="font-medium text-lg">Transações</span>
        {data.expense.map((item: any) => (
          <span
            key={item.categoryName}
            className="category-label"
            onClick={() =>
              console.log(
                `Valor gasto para ${item.categoryName}: ${item.totalSpent}`
              )
            }
          >
            {item.categoryName}
          </span>
        ))}
      </div>

      {error && <Alert message={error} type="error" />}
    </>
  );
}
