import { useEffect, useState } from "react";
import { Board, Column, Task } from "../types";
import TaskItem from "./TaskItem";
import Modal from "./Modal";
import DeleteModal from "./DeleteModal";
import {
  useEditColumnTitleMutation,
  useGetColTaskQuery,
} from "../redux/slices/boardSlice";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdBackHand } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import TaskDetails from "./TaskDetails";
import AddTaskHandler from "./AddTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotLoader } from "react-spinners";
import { useToast } from "../hooks/useToast";

interface Props {
  column: Column;
  board: Board;
}

export default function ColumnItem({ column, board }: Props) {
  const [isEditColumn, setIsEditColumn] = useState(false);
  const [selectColumn, setSelectColumn] = useState<Column>();
  const [selectTask, setSelectTask] = useState<Task>();
  const [editedTitle, setEditedTitle] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const { success, errorToast } = useToast();

  const [editColumnTitle] = useEditColumnTitleMutation();
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch: refetchTasks,
  } = useGetColTaskQuery(
    { boardId: board._id, columnId: column?._id ?? "" },
    {
      skip: !board?._id || !column?._id,
    }
  );

  useEffect(() => {
    if (column) {
      refetchTasks();
    }
  }, [column, refetchTasks]);

  const editColumnHandler = async (
    boardId: string,
    columnId: string,
    editedTitle: string
  ) => {
    try {
      await editColumnTitle({
        boardId,
        columnId,
        editedTitle,
      }).unwrap();
      success("Column title updated successfully!");
      setIsEditColumn(false);
    } catch (error) {
      console.error("Error editing column title:", error);
      errorToast("Failed to update column title.");
    }
  };

  const editColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };
  const handleTaskClick = (task: Task) => {
    setSelectTask(task);
    setTaskModalOpen(true);
  };
  const handleAddTask = () => {
    setModalOpen(true);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column._id ?? crypto.randomUUID(),
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="h-full min-w-[260px] lg:min-w-[280px]">
        <div className="flex justify-between items-center">
          {isEditColumn && selectColumn?._id === column._id ? (
            <input
              className="bg-slate-900 border border-seccondColor mr-4 rounded-md text-white px-2 w-24 py-1 outline outline-1 outline-seccondColor focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              type="text"
              value={editedTitle}
              onChange={editColumnChange}
            />
          ) : (
            <h3
              {...listeners}
              {...attributes}
              className="space-y-2 text-lg font-semibold text-gray-400 cursor-move">
              {column.title}
            </h3>
          )}

          <div className="flex justify-center items-center gap-3 text-sm">
            {isEditColumn && selectColumn?._id === column._id ? (
              <>
                <button
                  onClick={() =>
                    editColumnHandler(board._id, column?._id ?? "", editedTitle)
                  }
                  className="hover:text-green-500 duration-200">
                  <CiBookmarkCheck />
                </button>
                <button
                  onClick={() => setIsEditColumn(false)}
                  className="hover:text-red-500 duration-200">
                  <MdBackHand />
                </button>
              </>
            ) : (
              <button
                className="hover:text-seccondColor duration-200"
                onClick={() => {
                  setIsEditColumn(true);
                  setSelectColumn(column);
                  setEditedTitle(column.title);
                }}>
                <FaPencil />
              </button>
            )}

            <button
              onClick={() => {
                setSelectColumn(column);
                setDeleteModalOpen(true);
              }}
              className="hover:text-red-500 duration-200">
              <FaRegTrashCan />
            </button>
            <button
              onClick={handleAddTask}
              className="hover:text-seccondColor duration-200">
              <IoMdAdd />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-gray-800 w-full lg:min-w-[280px] rounded-lg p-4  flex justify-center items-center  max-h-[250px] ">
            <DotLoader color="white" />
          </div>
        ) : error ? (
          <p className="text-red-500">Failed to load tasks.</p>
        ) : (
          <div className="bg-gray-800 overflow-x-hidden w-full lg:min-w-[280px] rounded-lg p-2 px-4 flex-1 overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-500 [&::-webkit-scrollbar-thumb]:bg-slate-700 max-w-64">
            {tasks?.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <DeleteModal
          boardId={board._id}
          type="column"
          item={selectColumn!}
          setCloseModal={() => setDeleteModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        {selectTask && (
          <TaskDetails
            close={() => setTaskModalOpen(false)}
            task={selectTask}
            columnId={column?._id ?? ""}
          />
        )}
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddTaskHandler
          refetchTasks={refetchTasks}
          onClose={() => setModalOpen(false)}
          initialValues={{
            title: "",
            description: "",
            deadline: null,
            subTasks: [{ id: crypto.randomUUID(), title: "", done: false }],
            columnId: column._id,
            status: "todo",
            piority: "low",
          }}
        />
      </Modal>
    </>
  );
}
