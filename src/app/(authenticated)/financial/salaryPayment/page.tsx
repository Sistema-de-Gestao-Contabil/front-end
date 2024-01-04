"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Select, { OptionProps } from "@/components/Select";
import Button from "@/components/Button";
import { useApi } from "@/hooks/useApi";
import { set, useForm } from "react-hook-form";
import SelectCategorys from "@/components/SelectCategorys";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

//Schema que representa cada input do formulário
const createTransactionForm = z.object({
  date: z.string().nonempty("A data deve ser informada."),
});
type CreateTransactionData = z.infer<typeof createTransactionForm>;

export default function Despesas() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionForm),
  });
//   const [companyId, setCompanyId] = useState<number>(0);
  const [companys, setCompanys] = useState<object[]>([]);
  const [salaryId, setSalaryId] = useState();
  const companyId = localStorage.getItem("companyId");
  console.log("00000000", companyId)

  //função para listar as empresas
  // const findAllCompanys = async () => {
  //     const response = await useApi('get', 'company')

  //     setCompanys(response)
  //     setCompanyId(response[0].id)
  // }

  //função para listar as categorias
  const findAllCategorys = async () => {
    const response = await useApi("get", "categorys");
    setSalaryId(response.result.find((e: any) => e.name == "Salário"));
  };

  const createTransaction = async (data: CreateTransactionData) => {
    console.log(data);
    const response = await useApi("post", "transactions", {
      date: data.date,
      type: "despesa",
      status: 1,
      companyId,
      //@ts-ignore
      categoryId: Number(salaryId!.id),
    });

    if (response.status == 201) {
      alert("Transações realizadas com sucesso.");
    }
  };

  useEffect(() => {
    findAllCategorys();
    // findAllCompanys()
  }, []);

  return (
    <>
      <Heading
        title="Salários"
        subtitle="Pagamento de salário dos funcionários"
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form className="flex flex-col w-full p-4 max-w-[600px]">
          {/* <label htmlFor="company" className="text-[#444557] mt-8">Empresa</label> */}

          {/* <select
                        name="companys"
                        className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                        onChange={(e) => setCompanyId(Number(e.target.value))}
                    >
                        {
                            companys.map((company: any) => {
                                return <option value={company.id}>{company.name}</option>
                            })
                        }
                    </select> */}

          <label htmlFor="date" className="text-[#444557] mt-8">
            Data
          </label>
          <input
            className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
            placeholder="Informe uma data"
            type="date"
            {...register("date")}
          />
          {errors.date && (
            <span className="text-[red] text-[14px]">
              {errors.date.message}
            </span>
          )}

          <Button
            className="m-auto mt-8 w-[200px]"
            type="button"
            onClick={handleSubmit(createTransaction)}
          >
            Realizar Pagamento
          </Button>
        </form>
      </div>
    </>
  );
}
