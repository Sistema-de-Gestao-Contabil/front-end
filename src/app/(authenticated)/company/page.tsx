/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Heading from "@/components/Heading";
import Table from "@/components/Table";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { convert } from "../listPlanning/page";

export default function Company() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [company, setCompany] = useState<any>();
  const [activeButton, setActiveButton] = useState<
    "employee" | "transactions" | "planning"
  >("employee");

  useEffect(() => {
    let mounted = true;
    const reaload = async () => {
      if (mounted) {
        await useApi("get", "company").then((res) => {
          setData(res);
        });
      }
    };
    reaload();
  }, [isOpen]);
  const openModal = (id: number) => {
    setIsModalOpen(true);
    setModalInfo(id);
  };

  const openViewModal = async (id: number) => {
    await useApi("get", `company/${id}`).then((res) => {
      setCompany(res);
      setIsModalViewOpen(true);
    });
  };

  const closeViewModal = () => {
    setIsModalViewOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function handleDelete(id: number) {
    useApi("delete", `company/${id}`);
    setIsOpen(true);
    closeModal();
  }
  return (
    <>
      <Heading title="Empresas" subtitle="Listagem de empresas registradas" />

      <Table
        thOptions={["ID", "Empresa", "Phone", "Setor", "Endereço", "status"]}
        checkbox={false}
      >
        {data.length > 0 &&
          data.map((item: any) => {
            return (
              <tr key={item.id}>
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  #{item.id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-x-2">
                    <div>
                      <h2 className="text-sm font-medium text-gray-800 dark:text-white ">
                        {item.name}
                      </h2>
                      <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                        {item.email ? item.email : item.phone}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  {item.phone}
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  {item.sector.name}
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  {item.address}
                </td>

                <td className=" text-xs text-gray-500 dark:text-gray-300 w-4">
                  <div
                    data-negative={item.cashBalance < 0 ? true : false}
                    data-zero={item.cashBalance === 0 && true}
                    className="bg-emerald-50 text-emerald-600 data-[negative='true']:bg-red-50 data-[negative='true']:text-red-400  rounded-lg data-[zero='true']:bg-indigo-50 data-[zero='true']:text-indigo-400 text-center py-0.5 px-2"
                  >
                    <p>
                      {item.cashBalance === 0
                        ? "Zerado"
                        : item.cashBalance > 0
                        ? "Em Dia"
                        : "Negativado"}
                    </p>
                  </div>
                </td>

                <td className="p-4 flex items-center justify-end mr-10">
                  <button
                    className="relative select-none font-sans font-medium text-center uppercase justify-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-300"
                    type="button"
                    onClick={() => openViewModal(item.id)}
                  >
                    <Icon
                      className="text-gray-500 h-4 w-4 items-center justify-center transition-all m-auto"
                      icon="carbon:view"
                    />
                  </button>
                  <button
                    className="relative select-none font-sans font-medium text-center uppercase justify-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-300"
                    type="button"
                    onClick={() => router.push(`/edit-company/${item.id}`)}
                  >
                    <Icon
                      className="text-gray-500 h-4 w-4 items-center justify-center transition-all m-auto"
                      icon="fluent:pen-20-regular"
                    />
                  </button>
                  <button
                    className="relative select-none font-sans font-medium text-center uppercase justify-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-300"
                    type="button"
                    onClick={() => openModal(item.id)}
                  >
                    <Icon
                      className="text-gray-500 h-4 w-4 items-center justify-center transition-all m-auto"
                      icon="tabler:trash-filled"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="px-3 py-3  max-w-sm">
          <h2 className="text-lg font-medium mb-2">Apagar Empresa</h2>
          <hr />
          <p className="text-gray-400 mt-2">
            Se apagar esta empresa todos funcionários e transaões serão perdidas
            do sistema, deseja continuar?
          </p>
        </div>
        <div className="flex gap-3 mt-3 justify-end">
          <Button
            className="w-18 px-2 bg-transparent text-stone-300 hover:bg-zinc-200"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            className="w-18 px-2 bg-red-600 hover:bg-red-700"
            onClick={() => handleDelete(modalInfo)}
          >
            Confirmar
          </Button>
        </div>
      </Modal>

      {company && (
        <Modal isOpen={isModalViewOpen} onClose={closeViewModal}>
          <div className="flex">
            <div className="w-56 border-r-[0.5px]  h-[35rem] mr-10">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-gray-500 h-4 w-4"
                  icon="streamline:business-profession-home-office"
                />
                <p> {company.name}</p>
              </div>
              <div className="relative flex items-center focus-within:text-gray-600 my-3">
                <Icon
                  className="absolute ml-3 text-blue-700"
                  icon="material-symbols:business-center"
                  width="18"
                  height="18"
                />
                <Input
                  placeholder={company.sector.name}
                  disabled
                  className="pr-3 pl-10  rounded-sm text-xs w-44 h-8 bg-gray-100"
                />
              </div>

              <div className="relative flex items-center focus-within:text-gray-600">
                <Icon
                  className="absolute ml-3 text-gray-400"
                  icon="material-symbols:search"
                  width="18"
                  height="18"
                />
                <Input
                  placeholder="Buscar funcionário"
                  className="pr-3 pl-10 rounded-sm text-xs  w-44 h-8 bg-gray-100"
                />
              </div>

              {/* Atividades */}
              <div>
                <h6 className="text-sm text-gray-500 my-3">Atividades</h6>

                <button
                  onClick={() => setActiveButton("employee")}
                  className={`flex flex-row items-center p-2 rounded-lg hover:bg-gray-100 w-56 justify-between `}
                >
                  <div className="flex flex-row space-x-8 items-center text-[#9A9AA2]">
                    <Icon
                      className="absolute text-gray-400"
                      icon="fluent:people-team-28-regular"
                      width="18"
                      height="18"
                    />
                    {/* {item.icon} */}
                    <span className="text-sm  flex text-[#9A9AA2]">
                      Funcionários
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveButton("transactions")}
                  className={`flex flex-row items-center p-2 rounded-lg hover:bg-gray-100 w-56 justify-between `}
                >
                  <div className="flex flex-row space-x-8 items-center text-[#9A9AA2]">
                    <Icon
                      className="absolute text-gray-400"
                      icon="material-symbols-light:finance-mode-rounded"
                      width="18"
                      height="18"
                    />
                    {/* {item.icon} */}
                    <span className="text-sm  flex text-[#9A9AA2]">
                      Transações
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveButton("planning")}
                  className={`flex flex-row items-center p-2 rounded-lg hover:bg-gray-100 w-56 justify-between `}
                >
                  <div className="flex flex-row space-x-8 items-center text-[#9A9AA2]">
                    <Icon
                      className="absolute text-gray-400"
                      icon="clarity:analytics-outline-badged"
                      width="18"
                      height="18"
                    />
                    <span className="text-sm  flex text-[#9A9AA2]">
                      Planejamentos
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Funcionário */}
            {activeButton === "employee" && (
              <div className="flex flex-col sm:border-zinc-700 h-[30rem] w-[30rem]">
                <h3 className="text-2xl font-semibold ">Funcionarios</h3>
                {company?.employees.length > 0 ? (
                  <>
                    <div className="flex items-center my-3 gap-2">
                      <Icon className="text-gray-500 h-5 w-5" icon="ph:table" />
                      <p>Funcionários</p>
                    </div>
                    <div className="border-b-2 border-blue-600 w-32" />
                    <Table
                      thOptions={["Nome", "Cargo", "Telefone"]}
                      className="border-[0.5px]"
                      checkbox={false}
                    >
                      {company?.employees.map((item: any) => {
                        return (
                          <tr key={item.id}>
                            <td
                              onClick={() =>
                                router.push(`/edit-employee/${item.id}`)
                              }
                              className="cursor-pointer px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                            >
                              {item.name}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {item.office}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {item.phone}
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-[#8c8c8c]">
                    Nenhum funcionários registrada até o momento
                  </p>
                )}
              </div>
            )}

            {/* Transações */}
            {activeButton === "transactions" && (
              <div className="flex flex-col sm:border-zinc-700 h-[30rem] w-[30rem]">
                <h3 className="text-2xl font-semibold ">Transações</h3>

                {company?.transactions.length > 0 ? (
                  <>
                    <div className="flex items-center my-3 gap-2">
                      <Icon className="text-gray-500 h-5 w-5" icon="ph:table" />
                      <p>Transações</p>
                    </div>
                    <div className="border-b-2 border-blue-600 w-32" />
                    <Table
                      thOptions={["Valor", "Descrição", "Tipo", "Data"]}
                      className="border-[0.5px]"
                      checkbox={false}
                    >
                      {company?.transactions.map((item: any) => {
                        return (
                          <tr key={item.id}>
                            <td
                              //   onClick={() =>
                              //     router.push(`/edit-employee/${item.id}`)
                              //   }
                              className="cursor-pointer px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                            >
                              {item.value}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {item.description}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {item.type}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-[#8c8c8c]">
                    Nenhuma Transação Registrada até o momento
                  </p>
                )}
              </div>
            )}

            {/* Planejamento */}
            {activeButton === "planning" && (
              <div className="flex flex-col sm:border-zinc-700 h-[30rem] w-[30rem]">
                <h3 className="text-2xl font-semibold ">Planejamentos</h3>

                {company?.plannings.length > 0 ? (
                  <>
                    <div className="flex items-center my-3 gap-2">
                      <Icon className="text-gray-500 h-5 w-5" icon="ph:table" />
                      <p>Planejamentos</p>
                    </div>
                    <div className="border-b-2 border-blue-600 w-32" />
                    <Table
                      thOptions={["Mês", "Valor esperado"]}
                      className="border-[0.5px]"
                      checkbox={false}
                    >
                      {company?.plannings.map((item: any) => {
                        return (
                          <tr key={item.id}>
                            <td className="cursor-pointer px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {convert(item.month)}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {item.value}
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-[#8c8c8c]">
                    Nenhum planejamento cadastrado até o momento
                  </p>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
