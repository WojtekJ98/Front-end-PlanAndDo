import { useDispatch } from "react-redux";
import {
  deleteBoard,
  deleteColumn,
  deleteTask,
} from "../redux/slices/boardSlice";
import { Board, Column, Task } from "../types";
interface Props {
  item: Board | Column | Task;
  type: string;
  columnId: string;
  setCloseModal: () => void;
  close?: () => void;
}

export default function DeleteModal({
  item,
  type,
  columnId,
  setCloseModal,
  close,
}: Props) {
  const dispatch = useDispatch();

  const handleDeleteBoard = (id: string) => {
    console.log(`Deleting ${type}:`, id);
    if (type === "board") {
      dispatch(deleteBoard(id));
    } else if (type === "column") {
      dispatch(deleteColumn(item));
    } else if (type === "task") {
      dispatch(deleteTask({ columnId: columnId, taskId: id }));
    }
    if (close) {
      close();
    }
    setCloseModal(false);
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
            onClick={() => handleDeleteBoard(item.id)}
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
