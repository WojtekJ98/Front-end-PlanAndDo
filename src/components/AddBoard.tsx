import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Column } from "../types";
import * as Yup from "yup";
import { useDeleteColumnMutation } from "../redux/slices/boardSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddBoardFormValues {
  boardTitle: string;
  columns: Column[];
}

interface AddBoardProps {
  onSubmit: (values: AddBoardFormValues) => void;
  initialValues?: AddBoardFormValues;
  board: string;
}

const validationValues = Yup.object({
  boardTitle: Yup.string().required("Board Name is required"),
});

export default function AddBoard({
  board,
  onSubmit,
  initialValues = {
    boardTitle: "",
    columns: [{ _id: "", title: "" }],
  },
}: AddBoardProps) {
  const [deleteColumn] = useDeleteColumnMutation();

  const handleDeleteColumn = async (
    board: string,
    columnId: string,
    remove: (index: number) => void,
    index: number
  ) => {
    if (!columnId) {
      console.error("Invalid columnId:", columnId);
      return;
    }
    try {
      await deleteColumn({ boardId: board, columnId }).unwrap();

      console.log(`Column ${columnId} deleted successfully.`);
      remove(index);
      toast.success("Column delete successfully!");
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Failed to column delete.");
    }
  };

  return (
    <>
      <h1 className="font-semibold text-xl py-2">
        {initialValues.boardTitle ? "Edit Board" : "Add new board"}
      </h1>
      <Formik
        enableReinitialize
        validationSchema={validationValues}
        initialValues={initialValues}
        onSubmit={(values) => {
          const { boardTitle, columns } = values;

          onSubmit({
            boardTitle,
            columns: columns.map((col) => ({
              _id: col._id || "",
              title: col.title,
            })),
          });
        }}>
        {({ values }) => (
          <Form>
            <div className="space-y-2 flex flex-col pb-2 ">
              <label className="text-lg font-semibold">Name</label>
              <Field
                enablereinitialize
                required
                placeholder="e.g. App project or Selling plan"
                name="boardTitle"
                className="bg-gray-700 px-3 py-1 rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              />
              <ErrorMessage
                name="boardTitle"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="space-y-2 flex flex-col pb-2  pt-4">
              <label className="text-lg font-semibold">Columns</label>
              <FieldArray name="columns">
                {({ push, remove }) => (
                  <div className="space-y-4 flex flex-col">
                    {values.columns.map((column, index) => (
                      <div
                        key={column._id || `new-column-${index}`}
                        className="flex justify-between items-center gap-2">
                        <Field
                          required
                          className="bg-gray-700 flex-1 px-3 py-1  rounded-md border-[1px] border-seccondColor outline outline-1 outline-seccondColor placeholder:text-white focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                          name={`columns[${index}].title`}
                          value={column.title}
                          placeholder="e.g. Planning, Shoping"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (column._id) {
                              handleDeleteColumn(
                                board,
                                column._id,
                                remove,
                                index
                              );
                            } else {
                              remove(index);
                            }
                          }}
                          className=" text-white hover:text-red-500 duration-200">
                          <IoIosCloseCircleOutline className="text-2xl font-semibold  " />
                        </button>
                      </div>
                    ))}
                    <button
                      className="bg-seccondColor flex justify-center items-center font-semibold gap-4 rounded-full py-2 hover:bg-indigo-500 duration-200"
                      type="button"
                      onClick={() => push({ _id: undefined, title: "" })}>
                      <IoMdAddCircleOutline className="text-xl " />
                      Add new Column
                    </button>
                  </div>
                )}
              </FieldArray>
              <button
                className="font-semibold bg-thirdColor rounded-full py-2 hover:bg-opacity-50 duration-200"
                type="submit">
                {initialValues.boardTitle ? "Update Board" : "Create Board"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
