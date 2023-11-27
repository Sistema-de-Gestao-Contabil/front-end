"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Icon } from "@iconify/react";
import { SIDENAV_ITEMS, SideNavItem } from "@/constants";

import logo from "@/assets/logo.svg";

const SideNav = () => {
  return (
    <div className="md:w-60 bg-[#2F3044] h-screen flex-1 fixed border-r border-[#444557] hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="mt-6 flex flex-row space-x-4 items-center justify-center md:justify-start md:px-6 h-12 w-full"
        >
          <Image
            priority
            src={logo}
            alt="Follow us on Twitter"
            width={40}
            height={40}
          />

          <span className="font-bold text-xl text-white hidden md:flex">
            Sem Nome
          </span>
        </Link>

        <div className="flex flex-col space-y-2  md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-[#444557] w-full justify-between hover:bg-[#444557] ${
              pathname.includes(item.path) ? "bg-[#444557]" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center text-gray-300">
              {item.icon}
              <span className="font-semibold text-lg  flex text-gray-300">
                {item.title}
              </span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon
                icon="lucide:chevron-down"
                width="24"
                height="24"
                color="#C5C1C1"
              />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    } `}
                  >
                    <span className="text-gray-300">{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#444557] text-gray-300 ${
            item.path === pathname ? "bg-[#444557]" : ""
          }`}
        >
          {item.icon}
          <span className=" text-lg font-semibold flex text-gray-300">
            {item.title}
          </span>
        </Link>
      )}
    </div>
  );
};
