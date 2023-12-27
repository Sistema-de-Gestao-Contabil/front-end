import React, { ComponentProps } from "react";
export type ModalProps = ComponentProps<"div"> & {
  isOpen: boolean;
  onClose: () => void;
};
export default function Modal({
  isOpen = false,
  onClose,
  ...props
}: ModalProps) {
  const modalStyles = {
    display: isOpen ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    isOpen && (
      <div className="fixed inset-0 overflow-auto">
        <div
          className={`fixed inset-0 flex items-center justify-center ${modalStyles}`}
        >
          <div className="bg-black opacity-50 fixed inset-0" ></div>
          <div className="bg-white p-4 rounded shadow-md max-w-md w-full relative">
            <button
             className="absolute top-2 right-2 text-gray-600 cursor-pointer text-2xl"
             style={{ marginRight: '8px' }}
             onClick={onClose}
            >
              &times;
            </button>
            {props.children}
          </div>
        </div>
      </div>
    )
  );
}
