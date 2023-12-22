"use client";
import { useApi } from "@/hooks/useApi";
import React, { useState } from "react";
import { any, date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { Icon } from "@iconify/react/dist/iconify.js";

const select = z.object({
  id: z.number(),
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

export default function Planning() {
  const [planning, setPlanning] = useState<createOptionsFormData[]>([]);
  const [data, setData] = useState<createOptionsFormData[]>([]);
  const [despesas, setDespesas] = useState([]);
  const [options, setOptions] = useState<createOptionsFormData[]>([]);
  const [reload, setReload] = useState(true);
  const [situation, setSituation] = useState([""]);

  function convert(data: any) {
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

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<createPlanningFormData>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(select),
  });

  React.useEffect(() => {
    (async () => {
      await useApi("get", "/planning", planning)
        .then((response) => {
          return (
            setPlanning(response),
            setOptions(response),
            setReload(true),
            situacao(response)
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
        return setData(response), setPlanning([]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function clear() {
    setPlanning(options);
    setData([]);
  }

  async function remove(i: number) {
    if (window.confirm("Deseja realmente apagar este planejamento?")) {
      await useApi("delete", `/planning/${i}`)
        .then((response) => {
          console.log(response);
          setReload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function situacao(planejamento: any) {
    const data: string[][] = [];
    let arr1: any;
    let arr2: Array<string> = [];

    const l = planejamento.map((b: any) => {
      let x = b.planejamento.hasCategory.map((p: any) => p.valuePerCategory);
      let y = b.transaction.map((p: any) => p.categoriaSoma);
      arr1 = [];
      for (var i = 0; i < x.length; i++) {
        if (y[i] == null) {
          arr1.push(`Nenhuma despesa`);
        } else if (Number(x[i]) == Number(y[i]) && Number(y[i]) != null) {
          arr1.push("alcançou o limite");
        } else if (Number(x[i]) > Number(y[i]) && Number(y[i]) != null) {
          arr1.push("Dentro da meta planejada");
        } else if (Number(x[i]) < Number(y[i])) {
          arr1.push("ultrapassou o limite");
        }
      }
      // arr2.push(arr1.join('\n'));
      console.log(arr2.push(arr1.join(" \n")));
    });
    setSituation(arr2);
  }

  console.log(situation);

  const id = watch("id");

  return (
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
                <option key={item.planejamento.id} value={item.planejamento.id}>
                  {convert(item.planejamento.month)}
                </option>
              ))
            : null}
        </select>
        <Button
          className="w-20 ml-12"
          type={"submit"}
          onClick={handleSubmit(onSubmit)}
        >
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
            {data.planejamento
              ? data.planejamento.map((item: any) => convert(item.month))
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
                <button onClick={() => remove(item.planejamento.id)}>
                  <Icon
                    icon="ph:trash"
                    className="text-[#6174EE]"
                    width="24"
                    height="24"
                  />
                </button>
                <b className="text-xl text-[#1E90FF] ">
                  {convert(item.planejamento.month)}
                </b>
              </div>
              <div className="grid grid-cols-5 border border-indigo-10">
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
                      <p>R$ {categoria.valuePerCategory}</p>
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
                          <p>
                            R${" "}
                            {transaction.categoriaSoma
                              ? transaction.categoriaSoma
                              : "0.00"}
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
                    <div >
                      <p>{situation[i]}</p>
                    </div>
                  </div>
                  {/* {situation
                    ? situation.map((situation, s) => (
                        <div key={s}>
                          <p>{situation[0]}</p>
                        </div>
                      ))
                    : null} */}
                </div>
              </div>
            </div>
          ))
        : null}
      {data
        ? data.map((item: any, i: number) => (
            <div className="mt-8" key={i}>
              <div>
                {/* <button onClick={() => remove(item.planejamento.id)}>
                  <Icon
                    icon="ph:trash"
                    className="text-[#6174EE]"
                    width="24"
                    height="24"
                  />
                </button> */}
                <b className="text-xl text-[#1E90FF]">
                  {convert(item.planejamento.month)}
                </b>
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
                        <p>R$ {categoria.valuePerCategory}</p>
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
                            <p>
                              R${" "}
                              {transaction.categoriaSoma
                                ? transaction.categoriaSoma
                                : "0.00"}
                            </p>
                          </div>
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}