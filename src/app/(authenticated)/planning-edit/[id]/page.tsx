"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PlanningForm from "@/components/PlanningForm";
import { useApi } from "@/hooks/useApi";
import Heading from "@/components/Heading";

interface PageProps {
  params: { id: number };
}

export default function EditPlanning({ params }: PageProps, props: any) {
  return (
    <div>
      <Heading title="Alterar Planejamento" subtitle="Atualize informações de seu planejamento"/>
      <PlanningForm id={params.id}/>
    </div>
  );
}