import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Column } from "../types";
import ColumnItem from "./ColumnItem";

export default function BoardView() {
  const boards = useSelector((state: RootState) => state.boards.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.boards.activeBoard
  );

  const activeB = boards.find((board) => board.id === activeBoard);

  if (!activeB) {
    return <p className="text-2xl p-4 text-white">No selected board</p>;
  }

  return (
    <section className="w-full py-4 mb-10 px-6 overflow-y-hidden h-full">
      <h1 className="text-2xl font-semibold pb-4 text-seccondColor">
        {activeB.title}
      </h1>
      <div className="w-full h-full text-white flex gap-8 ">
        {activeB?.columns?.map((column: Column) => (
          <ColumnItem column={column} />
        ))}
      </div>
    </section>
  );
}
