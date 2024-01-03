/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";

import Heading from "@/components/Heading";
import EmployeeForm from "@/components/EmploeyyForm";
import { useApi } from "@/hooks/useApi";

export default function RegisterEmployee(props: any) {
  const [isFirstCompanyUser, setFirstCompanyUser] = useState(false);

  useEffect(() => {
    useApi("get", `company/${props.searchParams.id}`).then((res) =>
      setFirstCompanyUser(res.employees.length > 0 ? false : true)
    );
  }, []);
  return (
    <>
      <div>
        <Heading />
        <EmployeeForm
          companyId={Number(props.searchParams.id)}
          firstCompanyUser={isFirstCompanyUser}
        />
      </div>
    </>
  );
}
