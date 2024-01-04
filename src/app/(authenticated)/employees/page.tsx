/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Input from "@/components/Input";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";

export default function Employees(props: any) {
  const router = useRouter();
  const [data, setData] = useState<[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const reaload = async () => {
      if (mounted) {
        await useApi("get", "employee/all/1").then((res) => {
          setData(res);
          setIsOpen(false);
        });
      }

      if (props.searchParams.success) {
        showAlert("sucesso ao criar");
      }
    };
    reaload();
  }, [isOpen]);
  const company = localStorage.getItem("companyId");

  const showAlert = (message: string) => {
    setAlert(message);
    setTimeout(() => {
      setAlert(null);
    }, 1550);
  };

  const openModal = (id: number) => {
    setIsModalOpen(true);
    setModalInfo(id);
    // setIsOptionDisabled(item && item.active ? true : false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function handleDownloadPDF() {

    try {
      const response = await fetch(`http://localhost:8181/report/${company}`);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `relatorio(${new Date().toLocaleDateString()}).pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
    }
  }

  async function handleDelete(id: number) {
    useApi("delete", `employee/${id}`);
    setIsOpen(true);
    closeModal();
  }
  async function handelEmployee() {
    router.push("/register-employee");
    router.refresh();
  }
  return (
    <>
      <Heading
        title="Funcionários"
        subtitle="Listagem e registro de funionários"
      />

      <div className="flex justify-between">
        <div className="relative flex items-center focus-within:text-gray-600">
          <Icon
            className="absolute ml-3 text-gray-500"
            icon="material-symbols:search"
            width="20"
            height="20"
          />
          <Input
            placeholder="Buscar Funcionários"
            className="md:w-80 pr-3 pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Link
            href={{ pathname: "/register-employee", query: { id: "1" } }}
            passHref
          >
            <Button iconName="ic:round-plus">Registrar</Button>
          </Link>

          <Button
            outline
            iconName="ph:export-light"
            onClick={handleDownloadPDF}
          >
            Export
          </Button>
          <div className="relative inline-block text-left">
            <Button
              outline
              iconName="ri:more-2-fill"
              className="w-9"

              // onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>
      <Table
        thOptions={[
          "Funcionário",
          "Cargo",
          "CPF",
          "Conta",
          "Salário",
          "Data Pagamento",
        ]}
        checkbox={isOpen}
      >
        {data.length > 0 &&
          data.map((item: any) => {
            return (
              <tr key={item.id}>
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
                  {item.office}
                </td>

                <td className="px-2 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full dark:bg-gray-800">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-white ">
                      {item.cpf}
                    </h2>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-x-2">
                    {item.bankAccount[0] ? (
                      <div>
                        <h2 className="text-sm font-medium  dark:text-white ">
                          {item.bankAccount[0].name}
                        </h2>
                        <p className="text-xs mt-1 font-normal text-gray-600 dark:text-gray-400">
                          {item.bankAccount[0].agency}
                          {item.bankAccount[0].numberAccount}
                        </p>
                      </div>
                    ) : (
                      "Não informado"
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  R${item.wage}
                </td>

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  Dia{" "}
                  {item.paymentDay < 10
                    ? `0${item.paymentDay}`
                    : `${item.paymentDay}`}
                </td>

                <td className="p-4 border-b border-gray-200  flex items-center justify-between">
                  <Link
                    href={{
                      pathname: "/employee-details",
                      query: { id: item.id },
                    }}
                    passHref
                  >
                    <button
                      className="relative select-none font-sans font-medium text-center uppercase justify-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-300"
                      type="button"
                      // onClick={() => handleDelete(item.id)}
                    >
                      <Icon
                        className="text-gray-500 h-4 w-4 items-center justify-center transition-all m-auto"
                        icon="carbon:view"
                      />
                    </button>
                  </Link>
                  <button
                    className="relative select-none font-sans font-medium text-center uppercase justify-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-300"
                    type="button"
                    onClick={() => router.push(`/edit-employee/${company}`)}
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
        <div>
          <div className="px-3 py-3">
            <h2 className="text-lg font-medium mb-2">Apagar funcionário</h2>
            <hr />
            <p className="text-gray-400 mt-2">
              Você não irá mais ser capaz de registrar seu salário ou vê-lo/a na
              lista de funcionários cadastrados.
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
        </div>
      </Modal>
      {alert && <Alert message={alert} />}
    </>
  );
}
