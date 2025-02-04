import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Column } from "../types";
import ColumnItem from "./ColumnItem";
import Modal from "./Modal";
import { useState } from "react";
import AddBoard from "./AddBoard";
import { useDispatch } from "react-redux";
import { editBoard } from "../redux/slices/boardSlice";

export default function BoardView({ isAsideHidden }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const boards = useSelector((state: RootState) => state.boards.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.boards.activeBoard
  );

  const activeB = boards.find((board) => board.id === activeBoard);

  const handleAddColumnToBoard = (values: {
    boardTitle: string;
    columns: string[];
  }) => {
    dispatch(
      editBoard({
        id: activeB?.id,
        boardTitle: values.boardTitle,
        columns: values.columns,
      })
    );
    setModalOpen(false);
  };

  if (!activeB) {
    return <p className="text-2xl p-4 text-white">No selected board</p>;
  }

  return (
    <section
      className={`w-full py-4  px-8 overflow-y-hidden h-[90vh]  overflow-x [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800  transition-all duration-300 
      ${isAsideHidden ? "-ml-[250px] w-full" : "ml-0 w-[calc(100%-250px)]"} `}>
      <h1 className="text-2xl font-semibold pb-4 text-seccondColor">
        {activeB.title}
      </h1>
      <div className="w-full h-full text-white flex gap-8  ">
        {activeB?.columns?.map((column: Column) => (
          <ColumnItem column={column} />
        ))}
        <div
          className=" mr-12 min-w-[250px] max-w-64 bg-gray-800 p-2 rounded-lg mt-6 h-64 flex justify-center items-center text-xl font-semibold hover:text-seccondColor hover:shadow-none duration-200 cursor-pointer bg-opacity-80 shadow-lg shadow-gray-800"
          onClick={() => setModalOpen(true)}>
          + Add column
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddBoard
          onSubmit={handleAddColumnToBoard}
          initialValues={{
            boardTitle: activeB.title,
            columns: activeB.columns,
          }}
        />
      </Modal>
    </section>
  );
}
