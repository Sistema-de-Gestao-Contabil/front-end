/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Button from "../Button";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useApi } from "@/hooks/useApi";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { formatCPF, formatPhoneNumber } from "@/utils/InputsFormats";
import Input from "../Input";
import Select from "../Select";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import Loading from "../Loading";
import Alert from "../Alert";

interface BankAccountProps {
  id: number;
  name: string;
  agency: string;
  numberAccount: string;
  active: boolean;
}

interface FormProps {
  companyId?: number;
  id?: number;
  firstCompanyUser?: boolean;
}

const createEmployeeFormSchema = z.object({
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
  user: z
    .object({
      email: z
        .string()
        .max(0)
        .or(z.string().email("This is not a valid email.")),
      roleId: z
        .string()
        .transform((roleId) => Number(roleId))
        .or(z.number()),
    })
    .nullable(),
  bankAccount: z
    .object({
      name: z.string().nullable(),
      agency: z.string().nullable(),
      numberAccount: z.string().nullable(),
      active: z
        .any()
        .transform((value) =>
          value === true || value === "true" ? true : false
        ),
    })
    .nullable(),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeFormSchema>;
export default function EmployeeForm({
  companyId,
  id,
  firstCompanyUser,
}: FormProps) {
  const router = useRouter();
  const [bankAccount, setBankAccount] = useState<BankAccountProps[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeFormSchema),
  });

  const [modalInfo, setModalInfo] = useState<{
    id?: number;
    title: string;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setreload] = useState(false);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const selectedRole = watch("user.roleId", 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10);
    if (!firstCompanyUser && !id) {
      setValue("user.roleId", 2);
    }

    if (id) {
      useApi("get", `employee/${id}`).then((res) => {
        setBankAccount(res.bankAccount);
        setValue("employee.name", res.name),
          setValue("employee.cpf", res.cpf),
          setValue("employee.office", res.office),
          setValue(
            "employee.dtBirth",
            new Date(res.dtBirth).toISOString().substr(0, 10)
          ),
          setValue("employee.paymentDay", res.paymentDay),
          setValue("employee.phone", res.phone),
          setValue("employee.wage", res.wage);
        if (res.bankAccount[0]) {
          setValue("bankAccount.name", res.bankAccount[0].name),
            setValue("bankAccount.agency", res.bankAccount[0].agency),
            setValue(
              "bankAccount.numberAccount",
              res.bankAccount[0].numberAccount
            ),
            setValue("bankAccount.active", res.bankAccount[0].active);
        }
        setreload(false);
      });
    }
  }, [reload]);

  useEffect(() => {
    if (Number(selectedRole) != 1 && !id) {
      setValue(
        "employee.office",
        `${Number(selectedRole) === 2 ? "Gestor(a)" : "Contador(a)"}`
      );
    }
    if (Number(selectedRole) === 1 && !id) {
      setValue("employee.office", "");
    }
  }, [selectedRole]);

  const openModal = (item?: BankAccountProps) => {
    setValue("bankAccount.name", item ? item.name : null),
      setValue("bankAccount.agency", item ? item.agency : null),
      setValue("bankAccount.numberAccount", item ? item.numberAccount : null);
    setValue("bankAccount.active", item ? item.active : false);
    setModalInfo({
      id: item?.id,
      title: item ? "Editar conta bancária" : "Criar nova conta bancária",
    });
    setIsModalOpen(true);
    setIsOptionDisabled(item && item.active ? true : false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: CreateEmployeeFormData) => {
    useApi("post", `employee/${companyId ? companyId : 1}`, data.employee)
      .then(async (res) => {
        if (data.bankAccount?.name != "") {
          useApi("post", `back-account/${res.id}`, data.bankAccount);
        }
        router.push("/employees");
      })
      .catch((err) => showAlert(err.response.data.message));
  };

  const onUpdate = (data: CreateEmployeeFormData) => {
    useApi("patch", `employee/${id}`, data.employee)
      .then(() => router.push("/employees"))
      .catch((err) => showAlert(err.response.data.message));
  };

  const onBankAccountSubimit = (data: CreateEmployeeFormData) => {
    useApi("post", `back-account/${id}`, data.bankAccount);
    closeModal();
    setreload(true);
  };

  const onBankAccountUpdate = (data: CreateEmployeeFormData) => {
    useApi("patch", `back-account/${modalInfo?.id}`, data.bankAccount).then(
      () => closeModal()
    );
    setreload(true);
  };

  const handlePhoneNumberChange = (e: { target: { value: any } }) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setValue("employee.phone", formatted);
  };

  const showAlert = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 1550);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <form
            onSubmit={!id ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
          >
            <div>
              <h2 className="my-5 text-xl text-gray-600 font-medium">
                Informações Pessoais
              </h2>
              <Input
                label="Nome"
                mandatory
                error={errors.employee?.name?.message}
                placeholder="Nome do funcionário"
                className={`rounded-md mt-2 `}
                {...register("employee.name", { required: true })}
              />

              <Input
                label="Data de nascimento"
                placeholder="exemple@exemple.com"
                type="date"
                className="rounded-md mt-2 "
                {...register("employee.dtBirth")}
                error={errors.employee?.dtBirth?.message}
              />
              <div className="justify-between flex gap-3">
                <div className="w-full">
                  <Input
                    label="Telefone"
                    mandatory
                    error={errors.employee?.phone?.message}
                    placeholder="(00)0000-0000"
                    className="rounded-md mt-2 "
                    {...register("employee.phone", { required: true })}
                    onChange={handlePhoneNumberChange}
                  />
                </div>

                <div className="w-full">
                  <Input
                    label="CPF"
                    maxLength={14}
                    minLength={14}
                    mandatory
                    error={errors.employee?.cpf?.message}
                    placeholder="000.000.000-00"
                    className="rounded-md mt-2 "
                    {...register("employee.cpf", { required: true })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mt-5 text-xl text-gray-600 font-medium">
                Informações contratuais
              </h2>
              <div>
                <div className="justify-between flex gap-3">
                  <div
                    className={`${
                      Number(selectedRole) === 1 ? "" : "hidden"
                    } relative w-5/6`}
                  >
                    <Input
                      label="Cargo"
                      mandatory
                      placeholder="digite o cargo"
                      className="rounded-md mt-2 pr-10 pl-3"
                      {...register("employee.office", { required: true })}
                      disabled={Number(selectedRole) != 1 ? true : false}
                    />
                    {Number(selectedRole) != 1 && (
                      <Icon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        icon="material-symbols:lock"
                        width="16"
                        height="16"
                        color="#C5C1C1"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      Number(selectedRole) === 1 ? "w-96" : "w-full"
                    }`}
                  >
                    <Select
                      label="Tipo"
                      options={[
                        { id: 1, name: "Funcionário comum" },
                        { id: 2, name: "Gestor(a)" },
                        { id: 3, name: "Contador(a)" },
                      ]}
                      data-disabled={firstCompanyUser}
                      disabled={firstCompanyUser}
                      className="mt-2 data-[disabled=true]:appearance-none"
                      {...register("user.roleId")}
                      color="#9A9AA2"
                    />
                  </div>
                </div>
                <div>
                  <div
                    className={`${Number(selectedRole) === 1 ? "hidden" : ""}`}
                  >
                    <Input
                      label="Email"
                      placeholder="exemple@exemple.com"
                      type="email"
                      className={`rounded-md mt-2`}
                      {...register("user.email")}
                    />
                  </div>
                  <div
                    className={`${
                      firstCompanyUser && "hidden"
                    } justify-between flex gap-3`}
                  >
                    <div className="w-full">
                      <Input
                        label="Salário"
                        mandatory
                        type="number"
                        step="0.01"
                        placeholder="2200.00"
                        className="rounded-md mt-2 "
                        {...register("employee.wage")}
                      />
                    </div>

                    <div className="w-full">
                      <Input
                        label="Dia do pagamento"
                        mandatory
                        type="number"
                        placeholder="dia 1"
                        className="rounded-md mt-2 "
                        min={1}
                        max={31}
                        onInput={(e) => {
                          let value = parseInt(e.currentTarget.value, 10);
                          if (isNaN(value) || value < 1 || value > 31) {
                            e.currentTarget.value = "";
                          }
                        }}
                        {...register("employee.paymentDay")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${firstCompanyUser && "hidden"}`}>
              <h2 className="my-5 text-xl text-gray-600 font-medium">
                Informações bancárias
              </h2>
              {!id ? (
                <div>
                  <Input
                    label="Nome da instituição"
                    placeholder="Nome da instituição"
                    className="rounded-md mt-2 "
                    {...register("bankAccount.name")}
                  />
                  <div className="justify-between flex gap-3">
                    <div className="w-full">
                      <Input
                        label="Agência"
                        placeholder="1234"
                        className="rounded-md mt-2 "
                        {...register("bankAccount.agency")}
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        label="Numero da conta"
                        placeholder="000123456789-0"
                        className="rounded-md mt-2 "
                        {...register("bankAccount.numberAccount")}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-[0.3px] border-solid border-gray-200 px-4 py-2 w-full rounded-md mt-2  items-center mb-5">
                  {bankAccount &&
                    bankAccount.map((item) => (
                      <div
                        key={item.id}
                        className="my-2 py-2 w-full px-3 bg-[#F5F5FE] text-gray-600 border-none ring-1  outline-none  ring-gray-100 focus:ring-gray-200"
                      >
                        <div
                          className="flex  items-center justify-between cursor-pointer"
                          onClick={() => openModal(item)}
                        >
                          <div className="flex items-center">
                            <div
                              data-active={item.active}
                              className={`h-3 w-3 mx-2 rounded-sm mt-2  bg-[#C5C1C1] hover:bg-blue-700 data-[active=true]:bg-blue-600`}
                            />
                            <div
                              data-active={item.active}
                              className="text-stone-300  data-[active=true]:text-[#444557]"
                            >
                              <p className="text-xs">{item.name}</p>
                              <p className="text-xs">
                                {item.agency} {item.numberAccount}
                              </p>
                            </div>
                          </div>
                          {item.active && (
                            <Icon
                              icon="material-symbols:lock"
                              width="16"
                              height="16"
                              color="#C5C1C1"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  <Button
                    className=" justify-self-end bg-[#E7F2FF] text-blue-600 mt-3 mb-1 hover:bg-[#DBECFF]"
                    type="button"
                    iconName="ic:round-plus"
                    onClick={() => openModal()}
                  >
                    Adicionar
                  </Button>
                </div>
              )}
            </div>

            <Button className=" justify-self-end mt-10" type="submit">
              Finalizar
            </Button>
          </form>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form
              onSubmit={
                modalInfo?.title != "Editar conta bancária"
                  ? handleSubmit(onBankAccountSubimit)
                  : handleSubmit(onBankAccountUpdate)
              }
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{modalInfo?.title}</h2>

                <div>
                  <div className="justify-between flex gap-3">
                    <div className="w-full">
                      <label>Nome da instituição</label>
                      <Input
                        placeholder="Nome da instituição"
                        className="rounded-md mt-2 mb-5"
                        {...register("bankAccount.name")}
                      />
                    </div>
                    {modalInfo?.title == "Editar conta bancária" && (
                      <div>
                        <label>Status</label>
                        <select
                          {...register("bankAccount.active")}
                          disabled={isOptionDisabled}
                          data-disabled={isOptionDisabled}
                          defaultValue={"true"}
                          className={`data-[disabled=true]:appearance-none 0 h-10 w-full px-3 bg-[#F5F5FE] text-gray-600 rounded-md mt-2  border-none ring-1  outline-none  ring-gray-100 focus:ring-gray-200`}
                        >
                          <option value={"true"} className="text-gray-600 ">
                            Ativa
                          </option>
                          <option value={"false"} className="text-gray-600 ">
                            Inativa
                          </option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="justify-between flex gap-3">
                    <div className="w-full">
                      <label>Agência</label>
                      <Input
                        placeholder="1234"
                        className="rounded-md mt-2 mb-5"
                        {...register("bankAccount.agency")}
                      />
                    </div>
                    <div className="w-full">
                      <label>Numero da conta</label>
                      <Input
                        placeholder="000123456789-0"
                        className="rounded-md mt-2 mb-5"
                        {...register("bankAccount.numberAccount")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex gap-3 mt-3 justify-end">
                <Button className="w-18 px-2" type="submit">
                  Salvar
                </Button>
                <Button className="w-18 px-2" outline onClick={closeModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Modal>
          {error && <Alert message={error} type="error" />}
        </>
      )}
    </>
  );
}
