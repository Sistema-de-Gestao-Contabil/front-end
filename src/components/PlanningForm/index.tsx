"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "../Button";

const hasCategorySchema = z.array(
  z.object({
    category: z.number().positive("Informe um valor válido"),
    valuePerCategory: z.number().positive("Informe um valor válido"),
  })
);

interface FormProps {
  companyId?: number;
  id?: number;
}

const planning = z
  .object({
    month: z.string().min(1, "Informar o mês do planejamento é obrigatório."),
    value: z.number().min(1, "Informe um valor válido"),
    hasCategory: hasCategorySchema,
  })
  .refine((fields) => fields.hasCategory.length > 0, {
    path: ["hasCategory"],
    message: "Informe pelo menos uma categoria",
  });

type createPlanningFormData = z.infer<typeof planning>;

export default function PlanningForm({ companyId, id }: FormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<createPlanningFormData>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(planning),
  });

  const [category, setCategorys] = useState([{ id: "", name: "" }]);
  const router = useRouter();

  const [availableValue, setAvailable] = React.useState(0);
  const [value, setValor] = React.useState(0);
  const [reload, setreload] = useState(false);

  const valuePerCategory = watch("hasCategory");

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "hasCategory",
  });

  useEffect(() => {
    if (id) {
      useApi("get", `planning/${id}`).then((res) => {
        res.map((a: any) => {
          setValue("month", a.planejamento["month"]),
            setValue("value", a.planejamento["value"]),
            setValor(a.planejamento["value"]);
          a.planejamento.hasCategory.map((b: any, index: number) => {
            setValue(`hasCategory.${index}.category`, b["category"].id);
            setValue(
              `hasCategory.${index}.valuePerCategory`,
              b["valuePerCategory"]
            );
            update(index, {
              category: b["category"].id,
              valuePerCategory: b["valuePerCategory"],
            });
          });
        });
        setreload(false);
      });
    }
  }, [reload]);

  React.useEffect(() => {
    (async () => {
      await useApi("get", "/categorys", category)
        .then((response) => {
          return setCategorys(response.result);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  function diminuirValorDisponivel() {
    const reduct: number[] = [];
    valuePerCategory.map((item) => {
      const initialValue = value;
      reduct.push(item.valuePerCategory);
      const subtr = reduct.reduce(
        (acumulator, currentvalue) => acumulator - currentvalue,
        initialValue
      );
      setAvailable(subtr);
    });
  }

  function aumentarValorDisponivel(id: number) {
    const initialValue = availableValue;
    const add = initialValue + valuePerCategory[id].valuePerCategory;
    setAvailable(add);
  }

  function handleClick() {
    diminuirValorDisponivel(),
      append({
        category: 0,
        valuePerCategory: 0,
      });
  }

  function handleClick2(id: number) {
    aumentarValorDisponivel(id), remove(id);
  }

  const onSubmit = (data: any) => {
    useApi("post", `/planning/${companyId ? companyId : 1}`, data)
      .then((response) => {
        console.log(response);
        setreload(true);
        router.push("/listPlanning");
      })
      .catch((error) => console.log(error));
  };

  const onUpdate = (data: any) => {
    useApi("patch", `planning/${id}`, data)
      .then(() => router.push("/listPlanning"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto px-4 flex min-h-screen flex-col bg-white">
      <form onSubmit={!id ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}>
        <div className="mt-12">
          <p className="text-center text-xl text-[#6174EE]">
            {!id ? <b>Registrar Planejamento</b> : <b>Alterar Planejamento</b>}
          </p>
          <hr className="mt-3 mb-4"></hr>
          <div>
            <p>Selecione o mês que deseja gerar o planejamento:</p>
            <input
              className="w-40 bg-[#E9E9FF] h-8 rounded"
              id="date"
              type="month"
              {...register("month", { required: true })}
            />
            {/* {errors.value && <p>{errors.month?.message}</p>} */}

            <p className="mt-8">Informe o valor que pretende gastar no mês:</p>
          </div>
          <div>
            <input
              className="w-40 bg-[#E9E9FF] h-8 rounded"
              id="number"
              min="0"
              type="number"
              placeholder="R$ 0.00"
              {...register("value", { required: true, valueAsNumber: true })}
              onChange={(event: any) => [
                setAvailable(event.target.value),
                setValor(event.target.value),
              ]}
            />
            {/* {errors.value && <p>{errors.value.message}</p>} */}
          </div>
          <hr className="mt-3 mb-4"></hr>
          <div>
            <div className="grid justify-items-center">
              <p className=" text-xl text-[#6174EE]">
                <b>Metas e Orçamentos</b>
              </p>
              <p className="text-sm text-[#908B8B]">
                Atribua um valor a cada categoria
              </p>
            </div>
            <div className="grid grid-cols-12 ml-3 mt-5">
              <Icon
                icon="tabler:pig-money"
                className="text-[#6174EE]"
                width="24"
                height="24"
              />
              <p className="ml-25">R${availableValue ? availableValue : 0.0}</p>
              {/* <p>{...register("planning.value")}</p> */}
              <Icon
                icon="nimbus:money"
                className="text-[#6174EE] ml-20"
                width="24"
                height="24"
              />
              <p className="ml-20">R${value ? value : 0.0}</p>
            </div>
            <div className="grid grid-cols-3">
              <p className="text-sm text-[#908B8B]">
                Valor restante disponível
              </p>
              <p className="text-sm text-[#908B8B]">Valor total informado</p>
            </div>
          </div>
          {fields.map((field, index) => (
            <div className="mt-5" key={field.id}>
              <div className="grid grid-cols-3">
                <p>Selecione a categoria:</p>
                <p className="ml-2">Informe o valor previsto de gasto:</p>
              </div>
              <div className="grid grid-cols-3">
                <select
                  // defaultValue={"DEFAULT"}
                  {...register(`hasCategory.${index}.category`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="DEFAULT" disabled>
                    nenhuma categoria selecionada
                  </option>
                  {category.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
                {/* {errors.value && <p>{errors.hasCategory?.map((item) =>item?.category?.message)}</p>} */}

                <input
                  className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="number"
                  step="0.01"
                  placeholder="R$ 0,00"
                  {...register(`hasCategory.${index}.valuePerCategory`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                ></input>
                {/* {errors.value && <p>{errors.hasCategory?.map((item) =>item?.valuePerCategory?.message)}</p>} */}

                <Button
                  type="button"
                  className="w-10 ml-2 text-center rounded-full"
                  iconName="gg:remove"
                  onClick={() => handleClick2(index)}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            className="w-10 ml-2 text-center rounded-full mt-5"
            iconName="gg:add"
            onClick={() => handleClick()}
          />
          <div className="flex justify-end">
            <Button type="submit">Finalizar</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
