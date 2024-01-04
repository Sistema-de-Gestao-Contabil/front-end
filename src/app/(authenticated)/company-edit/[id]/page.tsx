/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { PageProps } from "../../edit-employee/[id]/page";
import Heading from "@/components/Heading";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhoneNumber } from "@/utils/InputsFormats";
import { useApi } from "@/hooks/useApi";
import Select from "@/components/Select";
import { useRouter } from "next/navigation";

const createCompanyFormSchema = z.object({
  company: z.object({
    name: z.string().min(1, { message: "nome é um campo obrigatório" }),
    email: z
      .string()
      .min(1, { message: "email é um campo obrigatório" })
      .or(z.string().email("informe um email válidos.")),
    phone: z.string().min(0),
    address: z.string().min(1, { message: "endereço é um campo obrigatório" }),
    sectorId: z
      .string()
      .transform((roleId) => Number(roleId))
      .or(z.number()),
  }),
});

export type CreateCompanyFormData = z.infer<typeof createCompanyFormSchema>;
export default function CompanyEdit({ params }: PageProps) {
  const [sector, setSector] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    useApi("get", "sector").then((res) => setSector(res));
    useApi("get", `company/${params.id}`).then((res) => {
      setValue("company.name", res.name),
        setValue("company.email", res.email),
        setValue("company.phone", res.phone),
        setValue("company.address", res.address);
      setValue("company.sectorId", res.sector.id);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanyFormSchema),
  });

  const handlePhoneNumberChange = (e: { target: { value: any } }) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setValue("company.phone", formatted);
  };
  // console.log(sector);

  const onSubmit = (data: CreateCompanyFormData) => {
    console.log(data);
    useApi("patch", `company/${params.id}`, data.company).then(() =>
      router.push("/company")
    )
    .catch(err => console.log(err))
  };

  return (
    <div>
      <Heading
        title="Editar Empresa"
        subtitle="Atualize informações desta empresa"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="my-5 text-xl text-gray-600 font-medium">
            Informações da empresa
          </h2>
          <Input
            label="Nome"
            mandatory
            error={errors.company?.name?.message}
            placeholder="Nome da empresa"
            className={`rounded-md mt-2 `}
            {...register("company.name", { required: true })}
          />

          <div className="justify-between flex gap-3">
            <div className="w-full">
              <Input
                label="Email"
                mandatory
                placeholder="exemple@exemple.com"
                className="rounded-md mt-2 "
                {...register("company.email")}
                error={errors.company?.email?.message}
              />
            </div>
            <div className="w-full">
              <Input
                label="Telefone"
                mandatory
                error={errors.company?.phone?.message}
                placeholder="(00)0000-0000"
                className="rounded-md mt-2 "
                {...register("company.phone", { required: true })}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
          <Input
            label="Endereço"
            mandatory
            placeholder="digite o endereço"
            className="rounded-md mt-2 pr-10 pl-3"
            {...register("company.address", { required: true })}
            error={errors.company?.address?.message}

            // disabled={Number(selectedRole) != 1 ? true : false}
          />

          <Select
            label="Cargo"
            options={sector}
            className="mt-2 data-[disabled=true]:appearance-none"
            {...register("company.sectorId")}
            color="#9A9AA2"
          />
        </div>

        <Button className=" justify-self-end mt-10" type="submit">
          Finalizar
        </Button>
      </form>
    </div>
  );
}
