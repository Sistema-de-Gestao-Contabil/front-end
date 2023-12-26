"use client";
import React, { useEffect, useState } from "react";

import Heading from "@/components/Heading";
import PlanningForm from "@/components/PlanningForm";
import { useApi } from "@/hooks/useApi";

export default function RegisterPlanning(props: any) {
  // const [isFirstCompanyUser, setFirstCompanyUser] = useState(false);

  // useEffect(() => {
  //   useApi("get", `company/${props.searchParams.id}`).then((res) =>
  //     setFirstCompanyUser(res.employees.length > 0 ? false : true)
  //   );
  // }, []);
  return (
    <>
      <div>
        <Heading
          title="Planejamentos"
          subtitle="Gerencie seus planejamentos mensais"
        />
        <PlanningForm
          companyId={Number(props.searchParams.id)}
          // firstCompanyUser={isFirstCompanyUser}
        />
      </div>
    </>
  );
}
