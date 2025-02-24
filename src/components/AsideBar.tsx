import { useState } from "react";
import {
  setActiveBoard,
  useAddBoardMutation,
  useEditBoardMutation,
  useGetBoardsQuery,
} from "../redux/slices/boardSlice";
import Modal from "./Modal";
import AddBoard from "./AddBoard";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { Board } from "../types";
import DeleteModal from "./DeleteModal";
import { FaOutdent, FaIndent } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { selectActiveBoard } from "../redux/selectors/selectActiveBoard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";

interface AsideBarProps {
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}

export default function AsideBar({ isHidden, setIsHidden }: AsideBarProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBoard, setSelecteBoard] = useState<Board | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editBoardData, setEditBoardData] = useState<Board | null>(null);
  const dispatch = useDispatch();

  const [addBoard] = useAddBoardMutation();
  const [editBoard] = useEditBoardMutation();
  const {
    data: boards = [],
    isLoading,
    error,
    refetch,
  } = useGetBoardsQuery(undefined, { refetchOnMountOrArgChange: true });

  const activeBoard = useSelector(selectActiveBoard);

  const handleAddBoard = async (values: {
    boardTitle: string;
    columns: { _id?: string; title: string }[];
  }) => {
    if (isEditMode && editBoardData) {
      try {
        const updatedColumns = values.columns.map((col) => ({
          _id: col._id || undefined,
          title: col.title,
        }));

        await editBoard({
          id: editBoardData._id,
          updateBoard: {
            title: values.boardTitle,
            columns: updatedColumns,
          },
        }).unwrap();
        refetch();
        toast.success("Board edited successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to edit board.");
      }
    } else {
      try {
        await addBoard({
          title: values.boardTitle,
          columns: values.columns.map((col) => ({ title: col.title })),
        }).unwrap();
        refetch();
        toast.success("Board added successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to add board.");
      }
    }
    setModalOpen(false);
    setEditMode(false);
    setEditBoardData(null);
  };
  const handleEditBoard = (board: Board) => {
    setEditMode(true);
    setEditBoardData(board);
    setModalOpen(true);
  };

  const handleSetActiveBoard = (_id: string) => {
    dispatch(setActiveBoard(_id));
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
    <aside
      className={`h-[91vh] border-r-[1px] py-4 pt-8 border-gray-500  relative  min-w-[250px] w-[250px]  transition-all duration-300  ${
        isHidden ? "-left-[250px]" : "left-0"
      }`}>
      <p className="text-gray-400 uppercase text-sm absolute top-1 left-2 ">
        All Boards ({boards.length})
      </p>
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="text-gray-400 uppercase text-sm absolute top-1 right-0 bg-seccondColor px-2 py-1 rounded-l-full transition-all duration-300">
        <FaOutdent className="text-white text-lg" />
      </button>
      {isHidden ? (
        <button
          onClick={() => setIsHidden(!isHidden)}
          className="
          text-gray-400
          uppercase
          text-sm
          absolute
          top-1
          -right-8
          bg-seccondColor
          px-2
          py-1
          rounded-r-full   transition-all  duration-300">
          <FaIndent className="text-white text-lg" />
        </button>
      ) : null}
      <div className="flex flex-col  py-2 pb-6 w-full pr-2  ">
        {boards.length > 0 ? (
          <ul className="space-y-2">
            {boards.map((board) => (
              <li
                onClick={() => {
                  handleSetActiveBoard(board._id);
                }}
                key={board._id}
                className={`flex gap-4 group cursor-pointer  justify-between items-center ${
                  activeBoard === board._id
                    ? "bg-indigo-500 text-white px-4 py-2 rounded-e-full"
                    : "bg-none text-indigo-500 "
                }`}>
                <p className="pl-8 font-semibold duration-200 text-xl text-center">
                  {board.title}
                </p>
                {activeBoard === board._id && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsPopupOpen(
                          isPopupOpen === board._id ? null : board._id
                        )
                      }
                      className="hidden group-hover:inline ">
                      <FaRegEdit />
                    </button>
                    {isPopupOpen === board._id && (
                      <div
                        onMouseLeave={() => setIsPopupOpen(null)}
                        className="absolute w-40 bg-gray-900 rounded-lg shadow-md shadow-gray-400">
                        <ul className="flex flex-col items-center ">
                          <li className="border-b-[1px] w-full text-center  font-semibold p-2 hover:text-indigo-500 duration-200">
                            <button
                              className="w-full"
                              onClick={() => {
                                handleEditBoard(board);
                              }}>
                              Edit Board
                            </button>
                          </li>
                          <li className="p-2 w-full text-center font-semibold hover:text-red-500 duration-200">
                            <button
                              className="w-full"
                              onClick={() => {
                                setDeleteModalOpen(true);
                                setSelecteBoard(board);
                              }}>
                              Delete Board
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <button
        onClick={() => {
          setModalOpen(true);
          setEditMode(false);
          setEditBoardData(null);
        }}
        className="text-seccondColor font-semibold text-center w-full hover:text-indigo-500 duration-200 text-2xl ">
        + Add new Board
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddBoard
          board={activeBoard as string}
          onSubmit={handleAddBoard}
          initialValues={{
            boardTitle: editBoardData?.title || "",
            columns: editBoardData
              ? editBoardData.columns.map((col) => ({
                  _id: col._id,
                  title: col.title,
                }))
              : [{ _id: undefined, title: "" }],
          }}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <DeleteModal
          type={"board"}
          item={selectedBoard!}
          setCloseModal={() => setDeleteModalOpen(!isDeleteModalOpen)}
        />
      </Modal>
    </aside>
  );
}
