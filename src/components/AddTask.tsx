import { Field, FieldArray, Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubTasks, Task } from "../types";
import { IoIosCloseCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectActiveBoardColumns } from "../redux/selectors/selectActiveBoardColumns";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/slices/boardSlice";

// interface DateValues {
//   deadline: Date | null;
// }

export interface AddTaskFormValues {
  id: string;
  title: string;
  description: string;
  deadline: Date | null;
  subTasks: SubTasks[];
  columnId: string;
  status: string;
  piority: string;
}
interface Props {
  handleUpdateTask: (values: AddTaskFormValues) => void;
  onClose: () => void;
  initialValues?: AddTaskFormValues;
}

export default function AddTaskHandler({
  handleUpdateTask,
  onClose,
  initialValues = {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    deadline: null,
    subTasks: [{ id: crypto.randomUUID(), title: "" }],
    columnId: "",
    status: "todo",
    piority: "low",
  },
}: Props) {
  const dispatch = useDispatch();
  const columns = useSelector(selectActiveBoardColumns);

  // const initialValues: AddTaskFormValues = {
  //   id: crypto.randomUUID(),
  //   title: "",
  //   description: "",
  //   deadline: { deadline: null, time: null },
  //   subTasks: [{ id: crypto.randomUUID(), title: "" }],
  //   columnId: "",
  //   status: "todo",
  //   piority: "low",
  // };
  const handleTaskSubmit = (values: AddTaskFormValues) => {
    const updatedTask: Task = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      deadline: values.deadline ? values.deadline.toISOString() : null,
      status: values.status,
      piority: values.piority,
      subTasks: values.subTasks,
    };

    if (!values.columnId) {
      console.error("Column ID is required to add a task.");
      return;
    }

    dispatch(addTask({ task: updatedTask, columnId: values.columnId }));

    onClose();
  };

  const handleFormSubmit = (values: AddTaskFormValues) => {
    if (initialValues.title) {
      handleUpdateTask(values); // Update an existing task
    } else {
      handleTaskSubmit(values); // Add a new task
    }
  };

  return (
    <>
      <div>
        <h1 className="font-semibold text-xl py-2">
          {initialValues.title ? "Edit Task" : "Add  Task"}
        </h1>
        <div className="overflow-y-auto h-[30rem] pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800">
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ setFieldValue, values }) => (
              <Form>
                <div className="space-y-2 flex flex-col pb-2 ">
                  <label className="text-lg font-semibold">Name</label>
                  <Field
                    enableReinitialize
                    required
                    placeholder="e.g. Planing the header section"
                    name="title"
                    className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                  />
                </div>
                <div className="space-y-2 flex flex-col pb-2 pt-4 ">
                  <label className="text-lg font-semibold">Description</label>
                  <Field
                    enableReinitialize
                    required
                    as="textarea"
                    placeholder="e.g. Add a Logo and the Nav"
                    name="description"
                    className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
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
                  {/* <div className="flex flex-col flex-1">
                    <label className="text-lg font-semibold">Time</label>
                    <DatePicker
                      selected={values.deadline?.time}
                      onChange={(time) => setFieldValue("deadline.time", time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                      placeholderText="Select a time"
                    />
                  </div> */}
                </div>
                <div className="flex justify-between items-center gap-4  pb-2 pt-4 ">
                  <div className="flex flex-col flex-1">
                    <label className="text-lg font-semibold">Status</label>
                    <Field
                      enableReinitialize
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
                      enableReinitialize
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
                            key={sub.id}
                            className="flex justify-between items-center gap-2">
                            <Field
                              className="bg-gray-700 flex-1 px-3 py-1  rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                              name={`subTasks[${index}].title`}
                              value={sub.title}
                              placeholder="e.g. Create a logo for the company"
                            />{" "}
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
                    <label className="text-lg font-semibold">
                      Assign to Column
                    </label>
                    <Field
                      requried
                      as="select"
                      name="columnId"
                      className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
                      <option value="" disabled>
                        Select a column
                      </option>
                      {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <button
                    className="font-semibold bg-thirdColor rounded-full py-2 hover:bg-opacity-50 duration-200"
                    type="submit">
                    {initialValues.title ? "Update Task" : " Create Task"}
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
