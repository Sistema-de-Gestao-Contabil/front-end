/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { endPoint, useApi } from "@/hooks/useApi";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";

const select = z.object({
  id: z.number(),
  companyId: z.number(),
});

const validate = z.object({
  planejamento: z.object({
    id: z.number(),
    month: z.string(),
    value: z.number(),
    hasCategory: z.array(
      z.object({
        category: z.any(),
        valuePerCategory: z.number(),
      })
    ),
  }),

  transaction: z.array(
    z.object({
      categoriaSoma: z.number(),
    })
  ),
});

const validateDespesa = z.object({
  value: z.number(),
  // dateValue: z.number(),
});

type createPlanningFormData = z.infer<typeof select>;
type createOptionsFormData = z.infer<typeof validate>;
// type createDespesasFormData = z.infer<typeof validateDespesa>;

export function convert(data: any) {
  if (data) {
    const [ano, mes] = data.split("-");
    const valor = parseInt(mes);
    var month = [
      "",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${month[valor]} de ${ano}`;
  } else {
    return null;
  }
}

export default function Planning() {
  const [planning, setPlanning] = useState<createOptionsFormData[]>([]);
  const [data, setData] = useState<createOptionsFormData[]>([]);
  const [despesas, setDespesas] = useState([]);
  const [options, setOptions] = useState<createOptionsFormData[]>([]);
  const [reload, setReload] = useState(false);
  const [situation, setSituation] = useState([""]);
  const [amountSpent, setSpent] = useState([0]);

  const [error, setError] = useState<string | null>();

  const router = useRouter();
  const company = localStorage.getItem("companyId");

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<createPlanningFormData>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(select),
  });

  const id = watch("id");

  React.useEffect(() => {
    (async () => {
      await useApi("get", `/planning/list/${company}`, planning)
        .then((response) => {
          return (
            setPlanning(response),
            setReload(false),
            situacao(response),
            // setValue("id", undefined),
            setData([]),
            setOptions(response)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [reload]);

  async function onSubmit() {
    await useApi("get", `/planning/${id}`)
      .then((response) => {
        return setData(response), setPlanning([]), situacaoData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function clear() {
    setData([]);
    setReload(true);
  }

  async function remove(i: number) {
    if (window.confirm("Deseja realmente apagar este planejamento?")) {
      try {
        await useApi("delete", `/planning/${i}`);
        clear();
      } catch (error) {
        console.log({ error: error });
      }
    }
  }

  function calculate(total: any, item: any) {
    return Number(total) + Number(item.categoriaSoma);
  }

  async function situacao(planejamento: any) {
    const calc: any[] = [];
    let arrCalc: any[] = [];
    let arr1: any;
    let arr2: Array<string> = [];

    const l = planejamento.map((b: any) => {
      let x = b.planejamento.hasCategory.map((p: any) => p.valuePerCategory);
      let y = b.transaction.map((p: any) => p.categoriaSoma);
      arr1 = [];
      for (var i = 0; i < x.length; i++) {
        if (y[i] == 0) {
          arr1.push(`Nenhuma despesa`);
        } else if (Number(x[i]) == Number(y[i]) && Number(y[i]) != null) {
          arr1.push("alcançou o limite");
        } else if (Number(x[i]) > Number(y[i]) && Number(y[i]) != null) {
          arr1.push("Dentro da meta");
        } else if (Number(x[i]) < Number(y[i])) {
          arr1.push("ultrapassou o limite");
        }
      }

      arr2.push(arr1.join("\n"));
      // sum.push(soma)
    });
    let soma: any;

    for (var i = 0; i < planejamento.length; i++) {
      const dados = planejamento[i].transaction;
      arrCalc.push(dados);
      soma = arrCalc.map((item, index) => {
        let calculo = arrCalc[index].reduce(calculate, 0);
        return calculo;
      });
    }

    calc.push(soma);
    setSpent(calc[0]);
    setSituation(arr2);
  }

  async function situacaoData(data: any) {
    const calc: any[] = [];
    let arrCalc: any[] = [];
    let arr1: any;
    let arr2: Array<string> = [];

    const l = data.map((b: any) => {
      let x = b.planejamento.hasCategory.map((p: any) => p.valuePerCategory);
      let y = b.transaction.map((p: any) => p.categoriaSoma);
      arr1 = [];
      for (var i = 0; i < x.length; i++) {
        if (y[i] == 0) {
          arr1.push(`Nenhuma despesa`);
        } else if (Number(x[i]) == Number(y[i]) && Number(y[i]) != null) {
          arr1.push("alcançou o limite");
        } else if (Number(x[i]) > Number(y[i]) && Number(y[i]) != null) {
          arr1.push("Dentro da meta");
        } else if (Number(x[i]) < Number(y[i])) {
          arr1.push("ultrapassou o limite");
        }
      }

      arr2.push(arr1.join("\n"));
      // sum.push(soma)
    });
    let soma: any;

    for (var i = 0; i < data.length; i++) {
      const dados = data[i].transaction;
      arrCalc.push(dados);
      soma = arrCalc.map((item, index) => {
        let calculo = arrCalc[index].reduce(calculate, 0);
        return calculo;
      });
    }

    calc.push(soma);
    setSpent(calc[0]);
    setSituation(arr2);
  }

  async function handleDownloadPDF(id: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado. Usuário não autenticado.");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await endPoint.get(`planning/generate-pdf/${id}`, {
        responseType: "blob",
        headers,
      });

      if (response.status === 200 || response.status === 201) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `relatorio-planejamentos(${new Date().toLocaleDateString()}).pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      showAlert(`Não há nenhum planejamento para este mês"`);
      console.error("Error downloading report:", error);
    }
  }

  // async function handleDownloadPDF(id: number) {
  //   console.log(id)
  //   try {
  //     const response = await endPoint.get(`planning/generate-pdf/${id}`, {
  //       responseType: "blob",
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       const blob = new Blob([response.data], {
  //         type: response.headers["content-type"],
  //       });
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = `relatorio-planejamentos(${new Date().toLocaleDateString()}).pdf`;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   } catch (error) {
  //     showAlert(`Não há nenhum planejamento para este mês"}`);
  //     console.error("Error downloading report:", error);
  //   }
  // }
  const showAlert = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const companyId = watch("companyId");

  return (
    <>
      <div className="container mx-auto px-4 flex min-h-screen flex-col bg-white">
        <p className="text-xl mt-5">Planejamentos</p>
        <p className="text-sm text-[#908B8B]">
          Listagem de planejamentos mensais
        </p>
        {/* {despesas.map((item) => item.id)} */}
        <p className="mt-8">Filtrar planejamento por mês:</p>
        <div className="grid grid-cols-8">
          <select
            {...register(`id`, {
              required: true,
              valueAsNumber: true,
            })}
            defaultValue={"DEFAULT"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-40"
          >
            <option value="DEFAULT" disabled>
              selecione o mês
            </option>
            {options
              ? options.map((item) => (
                  <option
                    key={item.planejamento.id}
                    value={item.planejamento.id}
                  >
                    {convert(item.planejamento.month)}
                  </option>
                ))
              : null}
          </select>
          <Button className="w-20 ml-12" type={"submit"} onClick={onSubmit}>
            Buscar
          </Button>
          <Button className="w-20 ml-4" type={"button"} onClick={clear}>
            Limpar
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <p className=" text-xl text-[#6174EE]">
              <b>Análises e Despesas </b>
            </p>
          </div>
          <div>
            <b className="text-xl text-[#1E90FF]">
              {data
                ? data.map((item: any) => convert(item.planejamento.month))
                : null}
            </b>
          </div>
          {planning.length == 0 && data.length == 0 ? (
            <p className="mt-5 text-sm text-[#8c8c8c]">
              Nenhum planejamento cadastrado até o momento
            </p>
          ) : null}
        </div>
        {planning && data
          ? planning.map((item, i) => (
              <div className="mt-8" key={i}>
                <div>
                  <div className="flex justify-between">
                    <div className="flex">
                      <b className="text-xl text-[#1E90FF] ">
                        - {convert(item.planejamento.month)} -
                      </b>
                      <p className="ml-4 text-[#1E90FF]">
                        Orçamento: R${item.planejamento.value} -{" "}
                      </p>
                      <p className="ml-4 text-[#1E90FF]">
                        Valor total gasto: R${amountSpent[i]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => remove(item.planejamento.id)}>
                        <Icon
                          icon="ph:trash"
                          className="text-[#6174EE]"
                          width="24"
                          height="24"
                        />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/planning-edit/${item.planejamento.id}`)
                        }
                      >
                        <Icon
                          className="text-[#6174EE]"
                          width="24"
                          height="24"
                          icon="fe:edit"
                        />
                      </button>

                      <Icon
                        className="text-[#6174EE] cursor-pointer"
                        width="24"
                        height="24"
                        icon="material-symbols:download"
                        onClick={() => handleDownloadPDF(item.planejamento.id)}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border">
                  <div>
                    <p className="bg-[#1E90FF] text-white text-center">
                      <b>Categoria</b>
                    </p>
                    {item.planejamento.hasCategory.map((categoria, index) => (
                      <div key={index}>
                        <p>{categoria.category.name}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="bg-[#1E90FF] text-white text-center">
                      <b>Expectativa de Gasto</b>
                    </p>
                    {item.planejamento.hasCategory.map((categoria, index) => (
                      <div key={index}>
                        <p className="text-center">
                          R$ {categoria.valuePerCategory}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="bg-[#1E90FF] text-white text-center">
                      <b>Despesa p/ Categoria</b>
                    </p>
                    {item.transaction
                      ? item.transaction.map((transaction, index) => (
                          <div key={index}>
                            <p className="text-center">
                              R$ {transaction.categoriaSoma}
                            </p>
                          </div>
                        ))
                      : null}
                  </div>
                  <div>
                    <div className="flex flex-col ">
                      <p className="bg-[#1E90FF] text-white text-center  ">
                        <b>Situação</b>
                      </p>
                      <div>
                        <p className="text-center whitespace-pre">
                          {situation[i]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
        {data &&
          data.map((item: any, i: number) => (
            <div className="mt-8" key={i}>
              <div className="flex justify-between">
                <div className="flex">
                  <p className="ml-4 text-[#1E90FF]">
                    Orçamento: R${item.planejamento.value} -{" "}
                  </p>
                  <p className="ml-4 text-[#1E90FF]">
                    Valor total gasto: R${amountSpent[i]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/planning-edit/${item.planejamento.id}`)
                    }
                  >
                    <Icon
                      className="text-[#6174EE]"
                      width="24"
                      height="24"
                      icon="fe:edit"
                    />
                  </button>

                  <Icon
                    className="text-[#6174EE] cursor-pointer"
                    width="24"
                    height="24"
                    icon="material-symbols:download"
                    onClick={() => handleDownloadPDF(item.planejamento.id)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div>
                  <p className="bg-[#1E90FF] text-white text-center">
                    <b>Categoria</b>
                  </p>
                  {item.planejamento.hasCategory.map(
                    (categoria: any, index: number) => (
                      <div key={index}>
                        <p>{categoria.category.name}</p>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <p className="bg-[#1E90FF] text-white text-center">
                    <b>Expectativa de Gasto</b>
                  </p>
                  {item.planejamento.hasCategory.map(
                    (categoria: any, index: number) => (
                      <div key={index}>
                        <p className="text-center whitespace-pre">
                          R$ {categoria.valuePerCategory}
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <p className="bg-[#1E90FF] text-white text-center">
                    <b>Despesa p/ Categoria</b>
                  </p>
                  {item.transaction
                    ? item.transaction.map(
                        (transaction: any, index: number) => (
                          <div key={index}>
                            <p className="text-center">
                              R$ {transaction.categoriaSoma}
                            </p>
                          </div>
                        )
                      )
                    : null}
                </div>
                <div>
                  <div className="flex flex-col ">
                    <p className="bg-[#1E90FF] text-white text-center  ">
                      <b>Situação</b>
                    </p>
                    <div>
                      <p className="text-center whitespace-pre">
                        {situation[i]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {error && <Alert message={error} type="error" />}
    </>
  );
}
