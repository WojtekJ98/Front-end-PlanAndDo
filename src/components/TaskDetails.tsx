import { Column, Task } from "../types";
import dayjs from "dayjs";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Modal from "./Modal";
import AddTaskHandler from "./AddTask";
import { useDispatch } from "react-redux";
import { editTask } from "../redux/slices/boardSlice";

interface Props {
  task: Task;
  columnId: string;
}

export default function TaskDetails({ task, columnId }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  //   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);

  const dispatch = useDispatch();

  const handleUpdateTask = (values: Task) => {
    if (isEditMode && editTaskData) {
      dispatch(
        editTask({
          taskId: editTaskData.id,
          columnId: columnId,
          updatedTask: {
            title: values.title,
            description: values.description,
            deadline: values.deadline,
            piority: values.piority,
            subTasks: values.subTasks,
          },
        })
      );
      setModalOpen(false);
      setEditMode(false);
    }
  };
  const handleEditTask = (task: Task) => {
    setEditMode(true);
    setEditTaskData(task);
    setModalOpen(true);
  };

  console.log(task.deadline);

  return (
    <>
      <div className="">
        <div className="flex justify-between items-center">
          <div className=" flex flex-col pb-2">
            <h1 className=" opacity-65 text-slate-900 font-semibold text-sm ">
              Title
            </h1>
            <span className="text-lg text-indigo-500 font-semibold">
              {task.title}
            </span>
          </div>
          <div className="text-sm flex-flex-col">
            <p className=" opacity-65 text-slate-900 font-semibold text-sm">
              Deadline
            </p>
            <p className="text-sm ">
              {task.deadline
                ? dayjs(task.deadline).format("DD.MM.YYYY")
                : "No Deadline"}
            </p>
          </div>
        </div>
        <div className="text-sm flex-flex-col">
          <p className=" opacity-65 text-slate-900 font-semibold text-sm">
            Description
          </p>
          <p className="text-lg ">{task.description}</p>
        </div>
        <div className="text-sm flex-flex-col mt-4">
          <p className="text-lg ">Subtask ({task.subTasks.length})</p>

          <div className="  ">
            {task.subTasks.map((st) => (
              <div className="my-1 bg-slate-800 p-2" key={st.id}>
                {st.title}
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
          <div className=" pt-4 ">
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
                  id: editTaskData.id,
                  title: editTaskData.title,
                  description: editTaskData.description,
                  deadline: editTaskData.deadline,
                  piority: editTaskData.piority,
                  subTasks: editTaskData.subTasks,
                  columnId: columnId,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
