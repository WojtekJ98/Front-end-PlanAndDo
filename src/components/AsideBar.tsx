import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addBoard,
  editBoard,
  setActiveBoard,
} from "../redux/slices/boardSlice";
import Modal from "./Modal";
import AddBoard from "./AddBoard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaRegEdit } from "react-icons/fa";
import { Board } from "../types";
import DeleteModal from "./DeleteModal";

export default function AsideBar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBoard, setSelecteBoard] = useState<Board | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editBoardData, setEditBoardData] = useState<Board | null>(null);

  const dispatch = useDispatch();

  const boards = useSelector((state: RootState) => state.boards.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.boards.activeBoard
  );

  const handleAddBoard = (values: {
    boardTitle: string;
    columns: string[];
  }) => {
    if (isEditMode && editBoardData) {
      dispatch(
        editBoard({
          id: editBoardData.id,
          boardTitle: values.boardTitle,
          columns: values.columns,
        })
      );
    } else {
      dispatch(addBoard({ title: values.boardTitle, columns: values.columns }));
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

  const handleSetActiveBoard = (id: string) => {
    dispatch(setActiveBoard(id));
  };
  console.log(boards);

  return (
    <aside className="w-full h-full border-r-[1px] py-4 pt-8 border-gray-500  relative pr-2">
      <p className="text-gray-400 uppercase text-sm absolute top-1 left-2 ">
        All Boards ({boards.length})
      </p>
      <div className="flex flex-col  py-2 pb-6 w-full ">
        {boards.length > 0 ? (
          <ul className="space-y-2">
            {boards.map((board) => (
              <li
                onClick={() => handleSetActiveBoard(board.id)}
                key={board.id}
                className={`flex gap-4 group cursor-pointer  justify-between items-center ${
                  activeBoard === board.id
                    ? "bg-indigo-500 text-white px-4 py-2 rounded-e-full"
                    : "bg-none text-indigo-500 "
                }`}>
                <p className="pl-8 font-semibold duration-200 text-xl text-center">
                  {board.title}
                </p>
                {activeBoard === board.id && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsPopupOpen(
                          isPopupOpen === board.id ? null : board.id
                        )
                      }
                      className="hidden group-hover:inline ">
                      <FaRegEdit />
                    </button>
                    {isPopupOpen === board.id && (
                      <div
                        onMouseLeave={() => setIsPopupOpen(null)}
                        className="absolute w-40 bg-gray-900 rounded-lg shadow-md shadow-gray-400">
                        <ul className="flex flex-col items-center ">
                          <li className="border-b-[1px] w-full text-center  font-semibold p-2 hover:text-indigo-500 duration-200">
                            <button
                              className="w-full"
                              onClick={() => handleEditBoard(board)}>
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
          onSubmit={handleAddBoard}
          initialValues={
            isEditMode && editBoardData !== null
              ? {
                  boardTitle: editBoardData.title,
                  columns: editBoardData.columns,
                }
              : undefined
          }
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}>
        <DeleteModal
          type={"board"}
          item={selectedBoard}
          setCloseModal={setDeleteModalOpen}
        />
      </Modal>
    </aside>
  );
}
