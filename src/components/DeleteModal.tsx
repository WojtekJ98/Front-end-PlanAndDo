import { useToast } from "../hooks/useToast";
import {
  useDeleteBoardMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
} from "../redux/slices/boardSlice";
import { Board, Column, Task } from "../types";

interface Props {
  item: Board | Column | Task;
  type: string;
  columnId?: string;
  boardId?: string;
  setCloseModal: (value: boolean) => void;
  close?: () => void;
}

export default function DeleteModal({
  item,
  type,
  columnId,
  boardId,
  setCloseModal,
  close,
}: Props) {
  const [deleteBoard] = useDeleteBoardMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { success, errorToast } = useToast();

  const handleDelete = async () => {
    if (!item._id) {
      errorToast("ID is required to delete a objcet.");
      return;
    }
    try {
      if (type === "board") {
        await deleteBoard({ id: item._id }).unwrap();

        success("Board delete successfully!");
      } else if (type === "column") {
        if (!boardId) {
          errorToast("Board ID is required to delete a column.");
          return;
        }
        await deleteColumn({ boardId, columnId: item._id }).unwrap();
        success("Column delete successfully!");
      } else if (type === "task") {
        if (!boardId || !columnId) {
          errorToast("Board ID and Column ID are required to delete a task.");
          return;
        }
        await deleteTask({ boardId, columnId, taskId: item._id }).unwrap();
        success("Task delete successfully!");
      }
      if (close) {
        close();
      }
      setCloseModal(false);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      errorToast(`Error deleting ${type}:`);
    }
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">
          Delete <span className="text-seccondColor">{item.title}</span>
        </h1>
        <p>
          Are you sure you want to remove this {type}{" "}
          <span className="text-seccondColor">{item.title}</span> ?{" "}
          {type === "board" &&
            "This will permanently delete the columns and tasks contained in it."}
        </p>
        <div className="flex justify-around items-center pt-2">
          <button
            onClick={handleDelete}
            className="px-4 py-1 text-lg font-semibold bg-red-400 rounded-lg hover:bg-red-500 duration-200">
            Yes
          </button>
          <button
            onClick={() => setCloseModal(false)}
            className="px-4 py-1 text-lg font-semibold bg-thirdColor rounded-lg hover:bg-seccondColor duration-200">
            No
          </button>
        </div>
      </div>
    </>
  );
}
