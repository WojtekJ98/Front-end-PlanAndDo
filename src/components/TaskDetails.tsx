import { Task } from "../types";
import dayjs from "dayjs";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./Modal";
import AddTaskHandler from "./AddTask";
import {
  useEditTaskMutation,
  useUpdateSubTaskMutation,
} from "../redux/slices/boardSlice";
import DeleteModal from "./DeleteModal";
import { useSelector } from "react-redux";
import { selectActiveBoard } from "../redux/selectors/selectActiveBoard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  task: Task;
  columnId: string;
  close: () => void;
}

export default function TaskDetails({ task, columnId, close }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [selectTask, setSelectTask] = useState<Task>();
  const [localTask, setLocalTask] = useState(task);

  const activeBoard = useSelector(selectActiveBoard);

  const [updateSubtask] = useUpdateSubTaskMutation();

  const [editTask] = useEditTaskMutation();

  const handleUpdateTask = async (values: Task) => {
    try {
      if (!activeBoard) {
        return;
      }
      if (isEditMode && editTaskData) {
        await editTask({
          boardId: activeBoard,
          taskId: editTaskData._id ?? "",
          columnId: columnId,
          updatedTask: {
            title: values.title,
            description: values.description,
            deadline: values.deadline,
            piority: values.piority,
            status: values.status,
            subTasks: values.subTasks,
          },
        });
        toast.success("Task edited successfully!");

        close();

        setModalOpen(false);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
      toast.error("Failed to edit task.");
    }
  };
  const handleEditTask = (task: Task) => {
    setEditMode(true);
    setEditTaskData(task);
    setModalOpen(true);
  };
  const handleDeleteTask = (task: Task) => {
    setSelectTask(task);
    setDeleteModalOpen(true);
  };
  const handleUpdateSubtask = async (subTaskId: string) => {
    console.log(subTaskId);
    if (!activeBoard) {
      return;
    }

    try {
      await updateSubtask({
        boardId: activeBoard,
        columnId: columnId,
        taskId: task._id ?? "",
        subTaskId: subTaskId,
      });
      setLocalTask((prevTask) =>
        prevTask
          ? {
              ...prevTask,
              subTasks: prevTask.subTasks.map((st) =>
                st.id === subTaskId ? { ...st, done: !st.done } : st
              ),
            }
          : prevTask
      );
      toast.success("Subtask updated successfully!");
    } catch (error) {
      console.error("Failed to update subtask:", error);
      toast.error("Failed to update subtask.");
    }
  };

  return (
    <>
      <div className="overflow-y-auto h-[30rem] pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800">
        <div className="flex justify-between items-center">
          <div className=" flex flex-col pb-2">
            <h1 className=" opacity-65 text-slate-900 font-semibold text-sm ">
              Title
            </h1>
            <span className="text-lg text-indigo-500 font-semibold">
              {task.title}
            </span>
          </div>
          <div className="text-sm flex flex-col">
            <p className=" opacity-65 text-slate-900 font-semibold text-sm">
              Deadline
            </p>
            <p
              className={`text-sm ${
                task.deadline ? "text-yellow-500" : "text-green-500"
              } `}>
              {task.deadline
                ? dayjs(task.deadline).format("DD.MM.YYYY")
                : "No Deadline"}
            </p>
          </div>
        </div>
        <div className="text-sm flex-flex-col break-words">
          <p className=" opacity-65 text-slate-900 font-semibold text-sm">
            Description
          </p>
          <p className="text-lg ">{task.description}</p>
        </div>
        <div className="text-sm flex-flex-col mt-4">
          <p className="text-lg ">Subtask ({task.subTasks.length})</p>

          <div className="  ">
            {task.subTasks.map((st) => (
              <div
                className="my-1 bg-slate-800 p-2 flex items-center gap-4"
                key={st.id}>
                <input
                  type="checkbox"
                  onChange={() => handleUpdateSubtask(st.id)}
                  checked={
                    localTask.subTasks.find((s) => s.id === st.id)?.done ||
                    false
                  }
                  className="w-3 h-3"
                />
                <p className={st.done ? "line-through text-gray-500" : ""}>
                  {st.title}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="inline-flex   gap-4 pt-4 border-b-[1px] border-indigo-500">
            <div className="flex flex-col items-center ">
              <span className="text-sm font-semibold text-indigo-500  ">
                Urgency
              </span>
              <span
                className={`font-bold ${
                  task.piority === "low"
                    ? "text-green-500 [text-shadow:_2px_2px_10px_rgb(0_201_81_/_0.8)]"
                    : task.piority === "medium"
                    ? "text-yellow-500 [text-shadow:_2px_2px_10px_rgb(239_177_0_/_0.8)]"
                    : "text-red-500 [text-shadow:_2px_2px_10px_rgb(241_44_54_/_0.8)]"
                }`}>
                {task.piority}
              </span>
            </div>
            <div className="flex flex-col items-center ">
              <span className="text-sm font-semibold text-indigo-500 ">
                Status
              </span>
              <span className="text-center">{task.status}</span>
            </div>
          </div>
          <div className=" pt-4  flex gap-2">
            <button
              onClick={() => handleDeleteTask(task)}
              className="px-3 py-1 bg-slate-500 rounded-lg flex items-center gap-2 hover:bg-red-500 duration-200">
              Delete <FaRegTrashCan />
            </button>
            <button
              onClick={() => handleEditTask(task)}
              className="px-3 py-1 bg-slate-500 rounded-lg flex items-center gap-2 hover:bg-seccondColor duration-200">
              Edit <FaRegEdit />
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddTaskHandler
          handleUpdateTask={handleUpdateTask}
          initialValues={
            isEditMode && editTaskData !== null
              ? {
                  title: editTaskData.title,
                  description: editTaskData.description,
                  deadline: editTaskData.deadline,
                  piority: editTaskData.piority,
                  status: editTaskData.status,
                  subTasks: editTaskData.subTasks,
                  columnId: columnId,
                }
              : undefined
          }
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <DeleteModal
          type={"task"}
          item={selectTask!}
          setCloseModal={() => setDeleteModalOpen(!isDeleteModalOpen)}
          columnId={columnId}
          boardId={activeBoard ?? ""}
          close={close}
        />
      </Modal>
    </>
  );
}
