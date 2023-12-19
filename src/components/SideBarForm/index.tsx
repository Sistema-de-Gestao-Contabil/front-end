"use client";
import React from "react";
import { Icon } from "@iconify/react";

export default function SideBarForm() {
  return (
    // <div className="md:w-2/5 bg-gray-400 h-screen  fixed border-r hidden  items-center justify-center">
    <div className="md:w-2/6 bg-[#F5F5FE] fixed h-screen flex items-center justify-center">
      <div className="md:block hidden text-gray-600">
        <h2 className="text-3xl text-center w-80 font-semibold">
          Registrar Novo Funcionário
        </h2>

        <div className="mx-10">
          <div className="flex my-10 items-center gap-5 ">
            <div className="w-10 h-10 text-[#E9E9FF] bg-blue-600 rounded-full flex items-center justify-center">
              <Icon icon="clarity:employee-solid" width="24" height="24" />
            </div>
            <p>Informações pessoais</p>
          </div>

          <div className="flex my-10 items-center gap-5">
            <div className="w-12 h-12 bg-[#E9E9FF] rounded-full flex items-center justify-center">
              <Icon
                icon="ic:twotone-work"
                width="24"
                height="24"
                color="#B3B3F3"
              />
            </div>
            <p>Informações contratuais</p>
          </div>

          <div className="flex my-10 items-center gap-5">
            <div className="w-12 h-12 bg-[#E9E9FF] rounded-full flex items-center justify-center">
              <Icon
                icon="icon-park-twotone:bank-card"
                width="24"
                height="24"
                color="#B3B3F3"
              />
            </div>
            <p>Informações bancárias</p>
          </div>

        </div>

      </div>
    </div>
  );
}
