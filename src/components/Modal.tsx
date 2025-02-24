import React from "react";
import ReactDOM from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="bg-gray-700 border-[1px] border-seccondColor rounded-lg p-6 w-full relative max-w-md text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2  hover:text-red-500 duration-200">
          <IoIosCloseCircleOutline className="text-2xl font-semibold  " />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
