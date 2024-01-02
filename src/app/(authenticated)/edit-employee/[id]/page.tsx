"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmployeeForm from "@/components/EmploeyyForm";
import { useApi } from "@/hooks/useApi";
import Heading from "@/components/Heading";

export interface PageProps {
  params: { id: number };
}

export default function EditEmploeyy({ params }: PageProps, props: any) {
  return (
    <div>
      <Heading title="Editar Funcionário" subtitle="Atualize informações dos funcionários"/>
      
      <EmployeeForm id={params.id}/>
    </div>
  );
}
