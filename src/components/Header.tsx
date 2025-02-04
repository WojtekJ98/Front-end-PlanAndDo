import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useAuth } from "../context/AuthProvider";
import Modal from "./Modal";
import { useState } from "react";
import AddTaskHandler from "./AddTask";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

  const { logout } = useAuth();

  return (
    <>
      <header className="w-full  h-16">
        <div className="h-16 w-full  text-white flex  text-2xl  border-b-[1px] border-gray-600">
          <div className="flex justify-center p-2 items-center sm:border-r-[1px]  sm:min-w-[250px] sm:w-[250px] border-gray-500 ">
            <Link to="/">
              <h2>ToDo Logo</h2>
            </Link>
          </div>
          <div className="w-full h-16 px-4 lg:px-12 py-4 text-white flex justify-end items-center  gap-12 ">
            <button
              onClick={() => setModalOpen(true)}
              className="px-2 sm:px-6 py-2 text-lg font-semibold flex items-center gap-2 justify-center bg-seccondColor rounded-full hover:bg-indigo-500 duration-200 shadow-sm shadow-gray-600">
              <IoMdAddCircleOutline className="text-xl " />
              <span className="hidden sm:inline">Add Task</span>
            </button>
            <button
              className="group flex items-center gap-2 font-semibold justify-center text-lg hover:text-seccondColor duration-200"
              onClick={logout}>
              <span className="hidden sm:inline">Logout</span>
              <MdLogout className="group-hover:translate-x-2 duration-300 " />
            </button>
          </div>
        </div>
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddTaskHandler onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
