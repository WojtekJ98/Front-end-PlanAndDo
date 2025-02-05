import { useSortable } from "@dnd-kit/sortable";
import { Task } from "../types";
import dayjs from "dayjs";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  onClick: () => void;
}

export default function TaskItem({ task, onClick }: Props) {
  const completedSubtasks = task.subTasks.filter((st) => st.done).length;
  const totalSubtasks = task.subTasks.length;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Reduce opacity while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border-[1px] my-3 p-2 rounded-lg border-slate-700 border-l-indigo-500 border-l-[2px] cursor-pointer shadow-gray-600 shadow-md duration-200 hover:shadow-none">
      <div
        {...listeners}
        className="flex justify-between items-center pt-2 cursor-move">
        <h2 className="text-lg font-semibold text-seccondColor">
          {task.title}
        </h2>
      </div>

      {/* Task Content */}
      <div onClick={onClick}>
        <div className="p-2 text-wrap">
          <p className="text-sm truncate overflow-hidden whitespace-nowrap">
            {task.description}
          </p>
        </div>
        <div className="flex items-center gap-4 py-2">
          <span className="text-sm font-semibold text-seccondColor">
            SubTask
          </span>
          <span className="text-sm font-semibold text-seccondColor">
            ({completedSubtasks} of {totalSubtasks})
          </span>
        </div>
        <div className="flex justify-between items-start text-sm border-[1px] p-1 rounded-lg border-slate-700 shadow-sm shadow-slate-700">
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-semibold text-indigo-500">
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
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-semibold text-indigo-500">
              Status
            </span>
            <span className="text-center">{task.status}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-semibold text-indigo-500">
              Deadline
            </span>
            <span
              className={`text-[12px] text-center ${
                task.deadline ? "text-yellow-500" : "text-green-500"
              }`}>
              {task.deadline
                ? dayjs(task.deadline).format("DD.MM.YYYY")
                : "No Deadline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
