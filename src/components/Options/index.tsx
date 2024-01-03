"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
interface PageProps {
  params: { id: number };
}

export default function Options() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState([]);

  React.useEffect(() => {
    (async () => {
      await useApi("get", `/user/1`, user)
      .then((response) => {
          return setUser(response);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  function redirect() {
    router.push(`/edit-user/1`);
  }

  return (
    // <div className="md:w-2/5 bg-gray-400 h-screen  fixed border-r hidden  items-center justify-center">
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        <Icon icon="nimbus:ellipsis" width="24" height="24" />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 mr-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              onClick={() => redirect()}
              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              role="menuitem"
            >
              Editar Perfil
            </div>
            <div
              className="flex cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              role="menuitem"
            >
              <Icon icon="radix-icons:exit" width="24" height="20" />
              Sair
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
