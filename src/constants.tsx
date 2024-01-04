import { Icon } from "@iconify/react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};
const company = localStorage.getItem("role");

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Icon icon="material-symbols:dashboard" width="24" height="24" />,
  },
  {
    title: "Financeiro",
    path: "/financial",
    icon: (
      <Icon icon="material-symbols:finance-rounded" width="24" height="24" />
    ),
    submenu: true,
    subMenuItems: [
      { title: "Transações", path: "/financial/transactions" },
      { title: "Pagamento de Salários", path: "/financial/salaryPayment" },
    ],
  },
  {
    title: "Planejamento",
    path: "/planning",
    icon: <Icon icon="ic:baseline-add-chart" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "Registrar Planejamento", path: "/registerPlanning" },
      { title: "Planejamentos Mensais", path: "/listPlanning" },
    ],
  },

  // {
  //   title: "Funcionário",
  //   path: "/employees",
  //   icon: <Icon icon="mdi:user" width="24" height="24" />,
  // },
  ...(company === "ROLE_MANAGER" || company === "ROLE_ADMIN"
    ? [
        {
          title: "Funcionário",
          path: "/employees",
          icon: <Icon icon="mdi:user" width="24" height="24" />,
        },
      ]
    : []),

  ...(company === "ROLE_ADMIN"
    ? [
        {
          title: "Empresas",
          path: "/companys",
          icon: (
            <Icon icon="material-symbols:work-outline" width="24" height="24" />
          ),
        },
      ]
    : []),

  // {
  //   title: "Empresas",
  //   path: "/companys",
  //   icon: <Icon icon="material-symbols:work-outline" width="24" height="24" />,
  // },
  {
    title: "Historico",
    path: "/loginUser",
    icon: <Icon icon="ic:twotone-history" width="24" height="24" />,
  },
];
