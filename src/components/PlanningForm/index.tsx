"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "../Button";
import Alert from "../Alert";
import Modal from "../Modal";
import Select from "../Select";

const hasCategorySchema = z.array(
  z
    .object({
      category: z.string().min(0).optional().or(z.number()).optional(),
      valuePerCategory: z.number({
        invalid_type_error: "* É necessário informar o valor",
      }),
    })
    .optional()
);

interface FormProps {
  companyId?: number;
  id?: number;
}

interface categoryProps {
  id: number;
  name: string;
  companyId: number;
}

const planning = z
  .object({
    planning: z.object({
      month: z
        .string()
        .min(1, "* Informar o mês do planejamento é obrigatório."),
      value: z
        .number({ invalid_type_error: "* Informe o valor para orçamento" })
        .positive("* Por favor, informe um número maior que zero"),
      hasCategory: hasCategorySchema,
    }),
    category: z
      .object({
        name: z.string().optional(),
        type: z.string().optional(),
      })
      .optional(),
  })
  .refine((fields) => fields.planning.hasCategory.length, {
    path: ["planning.hasCategory"],
    message: "Você precisa adicionar itens antes de prosseguir.",
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
  const company = localStorage.getItem("companyId");

  const [category, setCategorys] = useState([
    { id: 0, name: "", company: 0, type: "" },
  ]);
  const router = useRouter();

  const [availableValue, setAvailable] = React.useState(0);
  const [value, setValor] = React.useState(0);
  const [reload, setreload] = useState(false);
  const [error, setError] = useState<string | null>();
  // const [errorRegister, setErrorRegister] = useState<string | null>();
  const [registerPermited, setRegisterPermited] = useState<string | null>(
    "true"
  );
  const [valueInformed, setValueInformed] = useState<string | null>();
  const [subtr, setSubtr] = useState<number>(0);
  const [valueCategory, setValueCategory] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const valuePerCategory = watch("planning.hasCategory");

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "planning.hasCategory",
  });

  useEffect(() => {
    if (id) {
      useApi("get", `planning/${id}`).then((res) => {
        res.map((a: any) => {
          setValue("planning.month", a.planejamento["month"]),
            setValue("planning.value", a.planejamento["value"]),
            setValor(a.planejamento["value"]);
          a.planejamento.hasCategory.map((b: any, index: number) => {
            setValue(
              `planning.hasCategory.${index}.category`,
              b["category"].id
            );
            setValue(
              `planning.hasCategory.${index}.valuePerCategory`,
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

  React.useEffect(() => {
    if (valuePerCategory && id) {
      const reduct: number[] = [];
      let subtr: any;
      valuePerCategory.map((item: any) => {
        const initialValue = value;
        reduct.push(item.valuePerCategory);
        subtr = reduct.reduce(
          (acumulator, currentvalue) => acumulator - currentvalue,
          initialValue
        );
        setAvailable(parseFloat(subtr.toFixed(2)));
        if (availableValue <= value) {
          setRegisterPermited("true");
        } else {
          setRegisterPermited("false");
        }
      });
    }
  }, [valuePerCategory]);

  React.useEffect(() => {
    if (valuePerCategory) {
      const reduct: number[] = [];
      let subtr: any;
      valuePerCategory.map((item: any) => {
        const initialValue = value;
        reduct.push(item.valuePerCategory);
        subtr = reduct.reduce(
          (acumulator, currentvalue) => acumulator - currentvalue,
          initialValue
        );
        setAvailable(parseFloat(subtr.toFixed(2)));

        if (availableValue <= value) {
          setRegisterPermited("true");
        } else {
          setRegisterPermited("false");
        }
      });
    }
  }, [valueCategory]);

  React.useEffect(() => {
    (async () => {
      await useApi("get", "/categorys", category)
        .then((response) => {
          setreload(false);
          return setCategorys(response.result);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [reload]);

  function aumentarValorDisponivel(id: number) {
    const initialValue = availableValue;
    const dado = valuePerCategory[id];
    if (dado) {
      const add = initialValue + dado.valuePerCategory;
      setSubtr(parseFloat(add.toFixed(2)));
      setAvailable(parseFloat(add.toFixed(2)));
    }
    // setErrorRegister(null);
  }

  function handleClick() {
    if (availableValue <= value) {
      setRegisterPermited("true");
    }
    if (
      registerPermited == "true" &&
      availableValue >= 0 &&
      availableValue <= value
    ) {
      if (value) {
        append({
          category: 1,
          valuePerCategory: 0,
        });
      } else {
        setValueInformed("* Informe o orçamento primeiro");
        setTimeout(() => {
          setValueInformed(null);
        }, 1550);
      }
    }
  }
  function handleClick2(id: number) {
    aumentarValorDisponivel(id), remove(id), setRegisterPermited("true");
  }

  const onSubmit = (data: any) => {
    if (
      registerPermited == "true" &&
      availableValue >= 0 &&
      availableValue <= value
    ) {
      useApi("post", `/planning/${company}`, data.planning)
        .then((response) => {
          setreload(true);
          router.push("/listPlanning");
        })
        .catch((err) => showAlert(err.response.data.message));
    } else {
      errorRegister(
        "os valores fornecidos nas categorias são maiores do que o orçamento"
      );
      setRegisterPermited("false");
    }
  };

  const onUpdate = (data: any) => {
    if (
      registerPermited == "true" &&
      availableValue >= 0 &&
      availableValue <= value
    ) {
      useApi("patch", `planning/${id}`, data.planning)
        .then(() => router.push("/listPlanning"))
        .catch((err) => console.log(err));
    } else {
      errorRegister(
        "os valores fornecidos nas categorias são maiores do que o orçamento"
      );
      setRegisterPermited("false");
    }
  };

  const registerCategory = (data: any) => {
    (async () => {
      await useApi(
        "post",
        `/categorys/${companyId ? companyId : 1}`,
        data.category
      )
        .then((response) => {
          setreload(true);
        })
        .catch((err) => showAlert(err.response.data.message));
    })();
  };

  function removeCategory(id: number) {
    (async () => {
      if (window.confirm("Deseja realmente apagar esta categoria?")) {
        await useApi(
          "delete",
          `/categorys/?id=${id}&&companyId=${companyId ? companyId : 1}`
        )
          .then((response) => {
            setreload(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })();
  }

  const showAlert = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const errorRegister = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 flex min-h-screen flex-col bg-white">
        <form onSubmit={!id ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}>
          <div className="mt-12">
            <p className="text-center text-xl text-[#6174EE]">
              {!id ? (
                <b>Registrar Planejamento</b>
              ) : (
                <b>Alterar Planejamento</b>
              )}
            </p>
            <hr className="mt-3 mb-4"></hr>
            <div>
              <p>Selecione o mês que deseja gerar o planejamento:</p>
              <input
                className="w-40 bg-[#E9E9FF] h-8 rounded"
                id="date"
                type="month"
                // error={errors.employee?.name?.message}
                {...register("planning.month", { required: true })}
              />
              {errors && (
                <p className="text-xs text-[red]">
                  {errors.planning?.month?.message}
                </p>
              )}
            </div>
            <p className="mt-8">Informe o valor que pretende gastar no mês:</p>
            <div>
              <input
                className="w-40 bg-[#E9E9FF] h-8 rounded"
                id="number"
                min="0"
                placeholder="R$ 0.00"
                onInput={(e) => {
                  let value = parseFloat(e.currentTarget.value);
                  if (isNaN(value) || value < 1) {
                    e.currentTarget.value = "";
                  }
                }}
                {...register("planning.value", {
                  required: true,
                  valueAsNumber: true,
                })}
                onChange={(event: any) => [
                  setAvailable(event.target.value),
                  setValor(event.target.value),
                ]}
              />
              {errors.planning?.value && (
                <p className="text-xs text-[red]">
                  {errors.planning.value?.message}
                </p>
              )}
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
              <div className="flex justify-center mt-10">
                <Icon
                  icon="tabler:pig-money"
                  className="text-[#6174EE]"
                  width="24"
                  height="24"
                />
                <div className="flex">
                  <p className="ml-25">
                    R$ {availableValue ? availableValue : "0.00"}
                  </p>
                  <p className="text-sm text-[#908B8B] ml-2">
                    {isNaN(valueCategory) && availableValue == 0
                      ? "(calculando...)"
                      : null}
                  </p>
                  {/* <p>{...register("planning.value")}</p> */}
                </div>
                <Icon
                  icon="nimbus:money"
                  className="text-[#6174EE] ml-20"
                  width="24"
                  height="24"
                />
                <div>
                  <p>R$ {value ? value : "0.00"}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <p className="text-sm text-[#908B8B]">
                  Valor restante disponível
                </p>
                <p className="text-sm text-[#908B8B] ml-10">
                  Valor total informado
                </p>
              </div>
            </div>

            {fields.map((field, index) => (
              <div className="mt-5" key={field.id}>
                <div className="flex justify-center">
                  <p className="text-center">Selecione a categoria</p>
                  <p className="text-center ml-10">
                    Informe o valor previsto para gasto
                  </p>
                </div>
                <div className="flex justify-center">
                  <select
                    // defaultValue={"DEFAULT"}
                    {...register(`planning.hasCategory.${index}.category`, {
                      valueAsNumber: true,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-55 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  <input
                    className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    step="0.01"
                    onInput={(e) => {
                      let value = parseFloat(e.currentTarget.value);
                      if (isNaN(value) || value < 1) {
                        e.currentTarget.value = "";
                      }
                      setValueCategory(value);
                    }}
                    placeholder="R$ 0,00"
                    {...register(
                      `planning.hasCategory.${index}.valuePerCategory`,
                      {
                        required: true,
                        valueAsNumber: true,
                      }
                    )}
                  ></input>

                  <Button
                    type="button"
                    className="w-10 ml-2 text-center rounded-full"
                    iconName="gg:remove"
                    onClick={() => handleClick2(index)}
                  />
                </div>
                <div className="grid grid-cols-2">
                  <button
                    type="button"
                    className="text-xs ml-60 text-center text-[#6174EE]"
                    onClick={() => openModal()}
                  >
                    Clique aqui para adicionar nova categoria
                  </button>
                </div>
                <div className="flex justify-center mt-4">
                  {errors?.planning?.hasCategory && (
                    <p className="text-xs text-[red]">
                      {errors.planning.hasCategory[index]?.category?.message}
                    </p>
                  )}
                  {errors?.planning?.hasCategory && (
                    <p className="text-xs text-[red]">
                      {
                        errors.planning.hasCategory[index]?.valuePerCategory
                          ?.message
                      }
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <div className="mt-8">
                <p className="text-sm text-[#938d83]">Adicionar itens</p>
              </div>
              <div>
                <Button
                  type="button"
                  className="w-10 ml-2 rounded-full mt-5"
                  iconName="gg:add"
                  onClick={() => handleClick()}
                />
              </div>
            </div>
            <p className="text-xs text-[red] text-center">
              {errors.planning?.hasCategory &&
                errors.planning.hasCategory.message}
            </p>
            {/* <p className="text-xs text-[red] text-center">{errorRegister}</p> */}
            <p className="text-xs text-[red] text-center">{valueInformed}</p>
            <div className="flex justify-end">
              <Button type="submit">Finalizar</Button>
            </div>
          </div>
        </form>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(registerCategory)}>
          <div>
            <div>
              <b className="text-lg">Criar categoria</b>
              <hr></hr>
            </div>
            <div>
              <div className="flex">
                <p className="mt-5">Informe o nome da categoria:</p>
                <p className="mt-5 ml-10">Tipo:</p>
              </div>
              <div className="flex">
                <input
                  className="w-60 bg-[#E9E9FF] h-8 rounded"
                  {...register("category.name")}
                />
                <Select
                  className="w-60 bg-[#E9E9FF] h-8 rounded ml-3"
                  options={[
                    {
                      id: 1,
                      name: "Receita",
                    },
                    {
                      id: 2,
                      name: "Despesa",
                    },
                  ]}
                  {...register("category.type")}
                />
                <Button type="submit" className="w-70 h-8 ml-2 text-center ">
                  Criar
                </Button>
              </div>
            </div>
          </div>
        </form>
        <div>
          <hr className="mt-3"></hr>
          <b className="text-lg">Categorias registradas</b>
          <div className="grid grid-cols-2">
            {category.map((categorias, index) => (
              <div className="flex" key={index}>
                <div>
                  {categorias.company && (
                    <button onClick={() => removeCategory(categorias.id)}>
                      {/* {item.planejamento.id} */}
                      <Icon
                        icon="ph:trash"
                        className="text-[#6174EE]"
                        width="24"
                        height="24"
                      />
                    </button>
                  )}
                </div>
                <div>
                  <p>{categorias.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {error && <Alert message={error} type="error" />}
    </>
  );
}
