import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubTasks, Task } from "../types";
import { IoIosCloseCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import { selectActiveBoard } from "../redux/selectors/selectActiveBoard";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useAddTaskMutation,
  useGetBoardQuery,
  useGetColumnsQuery,
} from "../redux/slices/boardSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";

export interface AddTaskFormValues {
  id?: string;
  title: string;
  description: string;
  deadline: Date | null;
  subTasks: SubTasks[];
  columnId?: string;
  status: "todo" | "in-progress" | "done";
  piority: "low" | "medium" | "high";
}
interface Props {
  handleUpdateTask?: (values: AddTaskFormValues) => void;
  onClose?: () => void;
  refetchTasks?: () => void;
  initialValues?: AddTaskFormValues;
}

const validationValues = Yup.object({
  title: Yup.string().required("Task name is required"),
  description: Yup.string().required("Task description is required"),
  columnId: Yup.string().required("You must select a column"),
});

export default function AddTaskHandler({
  handleUpdateTask,
  refetchTasks,
  onClose,
  initialValues = {
    title: "",
    description: "",
    deadline: null,
    subTasks: [{ id: crypto.randomUUID(), title: "", done: false }],
    columnId: "",
    status: "todo",
    piority: "low",
    id: "",
  },
}: Props) {
  const activeBoard = useSelector(selectActiveBoard) ?? "";

  const { data: board, isLoading, error } = useGetBoardQuery(activeBoard);

  const { data: columns = [] } = useGetColumnsQuery(board?._id ?? "", {
    skip: !board?._id,
  });
  const [addTask] = useAddTaskMutation();

  const handleTaskSubmit = async (values: AddTaskFormValues) => {
    const updatedTask: Task = {
      title: values.title,
      description: values.description,
      deadline: values.deadline instanceof Date ? values.deadline : null,
      status: values.status,
      piority: values.piority ?? "low",
      subTasks: values.subTasks?.map((sub) => ({
        id: sub.id || crypto.randomUUID(),
        title: sub.title,
        done: sub.done ?? false,
      })),
    };
    try {
      if (!values.columnId) {
        console.error("Column ID is required to add a task.");
        toast.error("Column ID is required to add a task");
        return;
      }
      console.log(updatedTask);

      if (!board?._id) {
        toast.error("Board ID is missing.");
        return;
      }
      await addTask({
        boardId: board?._id,
        columnId: values.columnId,
        newTask: updatedTask,
      });
      refetchTasks?.();
      onClose?.();
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task.");
    }
  };

  const handleFormSubmit = (values: AddTaskFormValues) => {
    if (initialValues.title) {
      handleUpdateTask?.(values);
    } else {
      handleTaskSubmit(values);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center">
        <DotLoader color="white" /> <p>Loading task form...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error loading boards.</p>;
  }

  return (
    <>
      <div>
        <h1 className="font-semibold text-xl py-2">
          {initialValues.title ? "Edit Task" : "Add  Task"}
        </h1>
        <div className="overflow-y-auto h-[30rem] pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800">
          <Formik
            validationSchema={validationValues}
            initialValues={initialValues}
            onSubmit={handleFormSubmit}>
            {({ setFieldValue, values }) => (
              <Form>
                <div className="space-y-2 flex flex-col pb-2 ">
                  <label className="text-lg font-semibold">Name</label>
                  <Field
                    required
                    placeholder="e.g. Planing the header section"
                    name="title"
                    className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="space-y-2 flex flex-col pb-2 pt-4 ">
                  <label className="text-lg font-semibold">Description</label>
                  <Field
                    as="textarea"
                    placeholder="e.g. Add a Logo and the Nav"
                    name="description"
                    className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="flex  items-center justify-between gap-2 pb-2 pt-4 ">
                  <div className="flex flex-col flex-1">
                    <label className="text-lg font-semibold">Deadline</label>
                    <DatePicker
                      selected={values.deadline}
                      onChange={(date) => setFieldValue("deadline", date)}
                      dateFormat="dd.MM.yyyy"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                      placeholderText="Select a date"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4  pb-2 pt-4 ">
                  <div className="flex flex-col flex-1">
                    <label className="text-lg font-semibold">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                      <option value="todo">Todo</option>
                      <option value="in-progress">In-progress</option>
                      <option value="done">Done</option>
                    </Field>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-lg font-semibold">Piority</label>
                    <Field
                      as="select"
                      name="piority"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Field>
                  </div>
                </div>
                <div className="space-y-2 flex flex-col pb-2  pt-4">
                  <label className="text-lg font-semibold">Add Subtask</label>
                  <FieldArray name="subTasks">
                    {({ push, remove }) => (
                      <div className="space-y-4 flex flex-col">
                        {values.subTasks.map((sub, index) => (
                          <div
                            key={sub.id || `new-subtask-${index}`}
                            className="flex justify-between items-center gap-2">
                            <Field
                              className="bg-gray-700 flex-1 px-3 py-1  rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                              name={`subTasks[${index}].title`}
                              value={sub.title}
                              placeholder="e.g. Create a logo for the company"
                            />
                            <button
                              onClick={() => remove(index)}
                              className=" text-white hover:text-red-500 duration-200">
                              <IoIosCloseCircleOutline className="text-2xl font-semibold  " />
                            </button>
                          </div>
                        ))}
                        <button
                          className="bg-seccondColor flex justify-center items-center font-semibold gap-4 rounded-full py-2 hover:bg-indigo-500 duration-200"
                          type="button"
                          onClick={() =>
                            push({ id: crypto.randomUUID(), title: "" })
                          }>
                          <IoMdAddCircleOutline className="text-xl " />
                          Add SubTask
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <div className="space-y-2 flex flex-col pb-2 pt-4 ">
                    <label htmlFor="columnId" className="text-lg font-semibold">
                      Assign to Column
                    </label>
                    <Field
                      id="columnId"
                      required
                      as="select"
                      name="columnId"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                      <option value="" disabled>
                        Select a column
                      </option>
                      {columns.map((column) => (
                        <option key={column._id} value={column._id}>
                          {column.title}
                        </option>
                      ))}
                    </Field>{" "}
                    <ErrorMessage
                      name="columnId"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <button
                    className="font-semibold bg-thirdColor rounded-full py-2 hover:bg-opacity-50 duration-200"
                    type="submit">
                    {initialValues.title ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
