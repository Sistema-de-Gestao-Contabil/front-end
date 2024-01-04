"use client";
import React, { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export type AlertProps = ComponentProps<"div"> & {
  message?: string;
  type?: "success" | "error" | "warning";
};

export default function Alert({
  message,
  type = "success",
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const alertVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);
  if (!isVisible) {
    return null;
  }
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`md:ml-60 mt-3 fixed top-0 left-0 right-0 z-50 justify-center rounded p-4 mb-4 font-bold flex gap-3`}
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          key="alert"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div
            data-error={type != "error" ? false : true}
            data-warning={type != "warning" ? false : true}
            className={twMerge(
              "bg-emerald-500 text-white border-emerald-500 border rounded p-4  mb-4 font-bold data-[error='true']:border-red-400 data-[error='true']:bg-red-600",
              className
            )}
            role="alert"
          >
            <div
              className="flex gap-3 "
              data-error={type != "error" ? false : true}
              data-warning={type != "warning" ? false : true}
            >
              <Icon
                icon={`${
                  type === "error" ? "ph:x-circle-fill" : "ep:success-filled"
                }`}
                width="24"
                height="24"
              />

              <p className="pr-1">{type == 'error' ? 'Erro' : 'Sucesso'}: {message}</p>
              <Icon
                icon="material-symbols-light:close"
                width="24"
                height="24"
                onClick={() => setIsVisible(false)}
                className="cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
