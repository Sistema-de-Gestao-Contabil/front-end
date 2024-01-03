/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useApi } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface FormProps {
  params: { id: number };
}

const userAuthenticated = z.object({
  usuario: z.object({
    email: z.string(),
    password: z.string(),
  }),
  employee: z.object({
    name: z.string().min(1, { message: "nome é um campo obrigatório" }),
    phone: z.string().min(1, { message: "telefone é um campo obrigatório" }),
    dtBirth: z.coerce.date().nullable().or(z.string()),
    cpf: z.string().min(1, { message: "CPF é um campo obrigatório" }),
    office: z.string(),
    wage: z
      .string()
      .transform((value) => (value ? Number(value) : null))
      .nullable()
      .or(z.number().default(1)),
    paymentDay: z
      .string()
      .transform((value) => (value ? Number(value) : null))
      .nullable()
      .or(z.number().default(1)),
  }),
});

type createUserFormData = z.infer<typeof userAuthenticated>;

export default function editUser({ params }: FormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setreload] = useState(false);
  const [user, setUser] = useState({ employee: { id: 0 } });
  const router = useRouter();

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<createUserFormData>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(userAuthenticated),
  });

  useEffect(() => {
    if (params.id) {
      useApi("get", `/user/${params.id}`, user)
        .then((res) => {
          console.log(res);
          setValue("usuario.email", res.email),
            setValue("usuario.password", res.password),
            setValue("employee.name", res.employee.name),
            setValue("employee.phone", res.employee.phone),
            setValue(
              "employee.dtBirth",
              new Date(res.employee.dtBirth).toISOString().substr(0, 10)
            );
          setValue("employee.cpf", res.employee.cpf),
            setValue("employee.office", res.employee.office),
            setValue("employee.paymentDay", res.employee.paymentDay),
            setValue("employee.wage", res.employee.wage);
          setUser(res);
          setreload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [reload]);

  const onUpdateUsuario = (data: createUserFormData) => {
    useApi("patch", `/user/${params.id}`, data.usuario)
      .then(() => {
        alert("Dados atualizados com sucesso."), setreload(true);
      })
      .catch((err) => console.log(err));
  };

  const onUpdateEmployee = (data: createUserFormData) => {
    console.log("data employee", data.employee);
    useApi("patch", `employee/${user?.employee.id}`, data.employee)
      .then(() => {
        alert("Dados atualizados."), setreload(true);
      })
      .catch((err) => console.log(err));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log(errors);
  return (
    <>
      <Heading
        title="Alterar dados pessoais"
        subtitle="Atualize suas informações"
      />
      <form onSubmit={handleSubmit(onUpdateEmployee)}>
        <div className="mx-44">
          <div className="mt-20">
            <Input
              label="Nome completo"
              mandatory
              {...register("employee.name")}
            ></Input>
          </div>
          <div className="grid grid-cols-2 mt-10">
            <div>
              <Input label="Telefone" {...register("employee.phone")}></Input>
            </div>
            <div className="ml-4">
              <Input
                label="Data de nascimento:"
                {...register("employee.dtBirth")}
              ></Input>
            </div>
          </div>
          <div>
            <button
              type={"button"}
              className="flex mt-20 text-[#6174EE]"
              onClick={() => openModal()}
            >
              {" "}
              <Icon icon="akar-icons:edit" width="24" height="24" />
              <p>Alterar e-mail e senha</p>
            </button>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Salvar +</Button>
          </div>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(onUpdateUsuario)}>
          <b className="text-lg text-center text-[#6174EE]">
            Alterar email e senha
          </b>
          <hr></hr>
          <div className="mt-4">
            <Input label="Email" {...register("usuario.email")}></Input>
          </div>
          <div>
            <Input label="Senha" {...register("usuario.password")}></Input>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="w-22">Confirmar</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
