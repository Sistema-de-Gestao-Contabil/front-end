/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Heading from "@/components/Heading";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";

export default function EmployeeDetails(props: any) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    useApi("get", `employee/${props.searchParams.id}`).then((res) => {
      setData(res);
    });
  }, []);

 

  return (
    <>
      <Heading
        title="Visualizar Detalhes"
        subtitle="Verifique informações dos funcionários"
      />
      {data && (
        <div>
          <div>
            <h2 className="my-5 text-xl text-gray-600 font-medium">
              Informações Pessoais
            </h2>

            <div className="flex gap-12">
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">Nome</label>
                <p className="mt-2 mb-5">{data.name}</p>
              </div>
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">
                  Data de nascimento
                </label>
                <p className="mt-2 mb-5">
                  {new Date(data.dtBirth).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">
                  Número de contato
                </label>
                <p className="mt-2 mb-5">{data.phone}</p>
              </div>
            </div>

            <div className="flex gap-12">
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">Cargo</label>
                <p className="mt-2 mb-5">{data.office}</p>
              </div>
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">CPF</label>
                <p className="mt-2 mb-5">{data.cpf}</p>
              </div>
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">Status</label>
                <p className="mt-2 mb-5">{data.status}</p>
              </div>
            </div>
          </div>

          <div>
            {data.bankAccount[0] && (
              <>
                <h2 className="my-5 text-xl text-gray-600 font-medium">
                  Informações Contratuais e Bancárias
                </h2>
                <div className="flex gap-12">
                  <div className="flex-col w-1/3">
                    <label className="text-lg text-stone-300">
                      Nome da Instituição
                    </label>
                    <p className="mt-2 mb-5">{data.bankAccount[0].name}</p>
                  </div>
                  <div className="flex-col w-1/3">
                    <label className="text-lg text-stone-300">Agência</label>
                    <p className="mt-2 mb-5">{data.bankAccount[0].agency}</p>
                  </div>
                  <div className="flex-col w-1/3">
                    <label className="text-lg text-stone-300">
                      Número da conta
                    </label>
                    <p className="mt-2 mb-5">
                      {data.bankAccount[0].numberAccount}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-12">
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">Salário</label>
                <p className="mt-2 mb-5">{data.wage}</p>
              </div>
              <div className="flex-col w-1/3">
                <label className="text-lg text-stone-300">
                  Dia para pagamento
                </label>
                <p className="mt-2 mb-5">dia {data.paymentDay}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
