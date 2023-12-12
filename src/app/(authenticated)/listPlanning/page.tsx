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
  id: z.number(),
  month: z.string(),
  hasCategory: z.array(z.object({
    category: z.any(),
    valuePerCategory: z.number(),
  })),

});

type createPlanningFormData = z.infer<typeof select>;
type createOptionsFormData = z.infer<typeof validate>;


export default function Planning() {
  const [planning, setPlanning] = useState<createOptionsFormData[]>([])
  const [data, setData] = useState<createOptionsFormData[]>([]);

  const [options, setOptions] = useState<createOptionsFormData[]>([]);


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
          return setPlanning(response), setOptions(response);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

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
    setPlanning(options)
    setData([])
  }

  async function remove(i: number) {
    await useApi("delete", `/planning/${i}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const id = watch("id");

  return (
    <div className="container mx-auto px-4 flex min-h-screen flex-col bg-white">
      <p className="text-xl mt-5">Planejamentos</p>
      <p className="text-sm text-[#908B8B]">
        Listagem de planejamentos mensais
      </p>
      <p className="mt-8">Selecione o planejamento que deseja mostrar:</p>
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
                <option key={item.id} value={item.id}>
                  {convert(item.month)}
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
        <Button
          className="w-20 ml-4"
          type={'button'}
          onClick={(clear)}
        >
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
              ? data.slice(0, 1).map((item) => convert(item.month))
              : null}
          </b>
        </div>
      </div>
      {planning && data
        ? planning.map((item, i) => (
            <table className="mt-5" key={i}>
              <thead>
                <tr>
                  <th>
                    <button onClick={() => remove(item.id)}>
                      <Icon
                        icon="ph:trash"
                        className="text-[#6174EE]"
                        width="24"
                        height="24"
                      />
                    </button>
                  </th>
                  <th className="text-xl align-center text-[#1E90FF]">
                    {convert(item.month)}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#6174EE] text-white rounded-md">
                  <td>Categoria</td>
                  <td>Expectativa de gasto</td>
                  <td>Despesa do mês</td>
                  <td>Situação</td>
                </tr>
                {item.hasCategory
                  ? item.hasCategory.map((item, index) => (
                      <tr key={index}>
                        <td> {item.category["name"]}</td>
                        <td>R${item.valuePerCategory}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          ))
        : null}
      {data ? (
        data.map((item, i) => (
            <table className="mt-5"  key={item.id}>
              <tbody>
                <tr className="bg-[#6174EE] text-white rounded-md">
                  <td>Categoria</td>
                  <td>Expectativa de gasto</td>
                  <td>Despesa</td>
                  <td>Situação</td>
                </tr>

                {item.hasCategory
                  ? item.hasCategory.map((item, index) => (
                      <tr key={index}>
                        <td> {item.category["name"]}</td>
                        <td>R${item.valuePerCategory}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
        ))
      ) : (
        <p>'Selecione o mês para análise'</p>
      )}
    </div>
  );
}
