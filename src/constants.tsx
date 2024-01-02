import { Icon } from "@iconify/react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

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
      { title: 'Transações', path: '/financial/transactions' },
    ],
  },
  {
    title: "Planejamento",
    path: "/planning",
    icon: <Icon icon="ic:baseline-add-chart" width="24" height="24" />,
    submenu: true,
     subMenuItems: [
        { title: 'Registrar Planejamento', path: '/registerPlanning' },
        { title: 'Planejamentos Mensais', path: '/listPlanning' },
      ],
  },
  {
    title: "Funcionário",
    path: "/employees",
    icon: <Icon icon="mdi:user" width="24" height="24" />,
    // submenu: true,
    // subMenuItems: [
    //   { title: 'Name', path: '/caminho' },
    // ],
  },
  {
    title: "Historico",
    path: "/historic",
    icon: <Icon icon="ic:twotone-history" width="24" height="24" />,
  },
];
