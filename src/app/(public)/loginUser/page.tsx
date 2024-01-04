/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";
import { z } from "zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import imgLogin from "@/assets/Croods Chart.png";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

const createUserFormSchema = z.object({
  user: z
    .object({
      email: z.string().email("Informe um email válido"),
      password: z
        .string()
        .min(6, { message: "deve conter ao menos 6 caracteres" }),
    })
    .nullable(),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export default function LoginUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const router = useRouter()


  const onSubmit = (data: CreateUserFormData) => {
    console.log(data);
    useApi("post", `login`, data.user)
      .then(async (res) => {
        console.log(res)

        const token = res?.access_token;
        const companyId = res?.company;
        const role = res?.role;
        const employee = res?.employee.name;
        const employeeId = res?.employee.name;

        localStorage.setItem('companyId', companyId);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', employee);
        localStorage.setItem('employeeId', employeeId);
        console.log(localStorage);
        router.push("/");


        // if (data.bankAccount?.name != "") {
        //   useApi("post", `back-account/${res.id}`, data.bankAccount);
        // }
        // router.push("/employees");
      })
    //   .catch((err) => showAlert(err.response.data.message));
  };

  // const handleSignupForm = (event: any) => {
  //     event.preventDefault()
  //     console.log({ email, password })

  // }
  return (
    <>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-1/2 mt-10 items-center justify-center">
          <Image
            priority
            src={imgLogin}
            alt="Follow us on Twitter"
            width={450}
            height={450}
          />

          <h1 className="w-[65%] font-bold flex items-center justify-center text-[#707290]">
            Acompanhe o controle financeiro da sua empresa
          </h1>
          <p className="w-[65%] flex items-center justify-center text-[#9A9AA1]">
            gerencie suas receitas e despesas
          </p>
        </div>

        <div className="w-1/3 mt-10">
          <h1 className="mb-10 font-bold text-lg flex items-center justify-center text-[#707290]">
            Faça login na sua conta
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full p-4 max-w-[600px]"
          >
            <Input
              label="Email"
              mandatory
              className="pl-6 w-full"
              placeholder="email@exemple.com"
              type="email"
              error={errors.user?.email?.message}
              {...register("user.email", { required: true })}
            />

            {/* <label htmlFor="password" className="text-[#444557]"></label> */}
            <div className="mt-9">
                <Input
                label="Senha"
                mandatory
                className="pl-3 w-full"
                placeholder="Informe uma senha"
                type="password"
                error={errors.user?.password?.message}
                {...register("user.password", { required: true })}
                />
            </div>
            <a
              href="/"
              className="mb-10  leading-6 hover:text-indigo-500 text-[#6174EE]"
            >
              esqueceu a senha?
            </a>

            <Button className="m-auto w-full" type="submit">
              Login
            </Button>
          </form>
          <p className="mt-10 text-center text-sm text-[#9A9AA2]">
            Ainda não tem uma conta?
            <a
              href="/registerUser"
              className="font-semibold leading-6 hover:text-indigo-500 text-[#6174EE]"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
