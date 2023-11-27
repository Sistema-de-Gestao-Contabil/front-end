"use client";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Input from "@/components/Input";

import React from "react";
import { Icon } from "@iconify/react";
import Select, { OptionProps } from "@/components/Select";
import Table from "@/components/Table";
import { useRouter } from 'next/navigation'

const data : OptionProps[] = [{ id: 1, name: "teste"}, {id: 2, name: "teste2"}]

export default function Employees() {
  const router = useRouter()

  return (
    <>
      <Heading
        title="Funcionários"
        subtitle="Listagem e registro de funionários"
      />
      <div className="flex justify-between">
        <div className=" relative flex items-center focus-within:text-gray-600">
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
          <Button iconName="ic:round-plus " onClick={() => router.push('/register-employee')} >Registrar</Button>
          <Button outline iconName="ph:export-light">Export</Button>
          <Button outline iconName="ri:more-2-fill" className="w-9" />
        </div>
      </div>

      {/* <div className="flex">
        <Select name="" options={data}></Select>
        <Select name="" options={data}></Select>
        <Select name="" options={data}></Select>
      </div> */}
      <Table options={[]}/>
    </>
  );
}
