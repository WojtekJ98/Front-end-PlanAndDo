import { useState } from "react";
import { Column, Task } from "../types";
import TaskItem from "./TaskItem";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import DeleteModal from "./DeleteModal";
import { editColumnTitle } from "../redux/slices/boardSlice";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdBackHand } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import TaskDetails from "./TaskDetails";

interface Props {
  column: Column;
}

export default function ColumnItem({ column }: Props) {
  const [isEditColumn, setIsEditColumn] = useState(false);
  const [selectColumn, setSelectColumn] = useState<Column>();
  const [selectTask, setSelectTask] = useState<Task>();
  const [editedTitle, setEditedTitle] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  const dispatch = useDispatch();

  const editColumnHandler = () => {
    setIsEditColumn(false);
    dispatch(editColumnTitle({ editedTitle, selectColumn }));
  };

  const editColumnChange = (e) => {
    setEditedTitle(e.target.value);
  };
  const handleTaskClick = (task: Task) => {
    setSelectTask(task);
    setTaskModalOpen(true); // Open TaskDetails modal
  };

  return (
    <>
      <div key={column.id} className="h-full min-w-[250px] ">
        <div className="flex justify-between items-center">
          {isEditColumn && selectColumn?.id === column.id ? (
            <input
              className="bg-slate-900 border-[1px] border-seccondColor mr-4 rounded-md text-white px-2 w-24 py-1  outline outline-1 outline-seccondColor  focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              type="text"
              value={editedTitle}
              onChange={(e) => editColumnChange(e)}
            />
          ) : (
            <h3 className="space-y-2 text-lg  font-semibold text-gray-400">
              {column.title}
            </h3>
          )}

          <div className="flex justify-center items-center gap-3 text-sm">
            {isEditColumn && selectColumn?.id === column.id ? (
              <>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="relative group">
                    <button
                      onClick={editColumnHandler}
                      className="hover:text-green-500 duration-200 ">
                      <CiBookmarkCheck />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg text-center">
                      Save changes{" "}
                    </span>
                  </div>
                  <div className="relative group">
                    <button
                      onClick={() => setIsEditColumn(false)}
                      className="hover:text-red-500 duration-200 ">
                      <MdBackHand />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg text-center">
                      No change{" "}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative group">
                  <button
                    className="hover:text-seccondColor duration-200"
                    onClick={() => {
                      setIsEditColumn(true);
                      setSelectColumn(column);
                      setEditedTitle(column.title);
                    }}>
                    <FaPencil />
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg text-center">
                    Edit Column
                  </span>
                </div>
              </>
            )}
            <div className="relative group">
              <button
                onClick={() => {
                  setSelectColumn(column);
                  setDeleteModalOpen(true);
                }}
                className="hover:text-red-500 duration-200">
                <FaRegTrashCan />
              </button>{" "}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg text-center">
                Delete Column
              </span>
            </div>
            <div className="relative group">
              <button className="hover:text-seccondColor duration-200">
                <IoMdAdd />
              </button>{" "}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg text-center">
                Add Task
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 w-full rounded-lg p-2 flex-1 overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-500 [&::-webkit-scrollbar-thumb]:bg-slate-700 max-w-64">
          {column?.tasks?.map((task) => (
            <TaskItem
              task={task}
              onClick={() => {
                handleTaskClick(task);
              }}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <DeleteModal
          type={"column"}
          item={selectColumn}
          setCloseModal={setDeleteModalOpen}
        />
      </Modal>
      <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        {selectTask && <TaskDetails task={selectTask} columnId={column.id} />}
      </Modal>
    </>
  );
}
