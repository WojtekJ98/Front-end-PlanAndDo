import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Column } from "../types";
import ColumnItem from "./ColumnItem";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import AddBoard from "./AddBoard";
import {
  useEditBoardMutation,
  useGetBoardsQuery,
  useGetColumnsQuery,
} from "../redux/slices/boardSlice";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DotLoader } from "react-spinners";
import { useToast } from "../hooks/useToast";

interface BoardViewProps {
  isAsideHidden: boolean;
}

export default function BoardView({ isAsideHidden }: BoardViewProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { success, errorToast } = useToast();

  const [editBoard] = useEditBoardMutation();

  const { data: boards = [], isLoading, error, refetch } = useGetBoardsQuery();
  const activeBoard = useSelector(
    (state: RootState) => state.boards.activeBoard
  );

  const activeB = boards.find((board) => board._id === activeBoard);
  const { data: columns = [] } = useGetColumnsQuery(activeB?._id ?? "", {
    skip: !activeB,
  });

  const handleAddColumnToBoard = async (values: {
    boardTitle: string;
    columns: { _id?: string; title: string }[];
  }) => {
    if (!activeB?._id) {
      errorToast("No active board selected.");
      return;
    }

    try {
      const updatedColumns = values.columns.map((col) => ({
        _id: col._id || undefined,
        title: col.title,
      }));
      await editBoard({
        id: activeB?._id,
        updateBoard: {
          title: values.boardTitle,
          columns: updatedColumns,
        },
      }).unwrap();
      refetch();
      success("Column added successfully!");
    } catch (error) {
      console.error("Failed to edit board:", error);
      errorToast("Failed to add column!");
    }

    setModalOpen(false);
  };

  const [optimisticColumns, setOptimisticColumns] = useState<Column[]>([]);

  useEffect(() => {
    if (activeB) {
      setOptimisticColumns(columns || []);
    }
  }, [activeB, columns]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    if (!activeB) {
      return;
    }

    const oldIndex = activeB?.columns.findIndex((col) => col._id === active.id);
    const newIndex = activeB?.columns.findIndex((col) => col._id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedColumns = arrayMove(
        [...activeB.columns],
        oldIndex,
        newIndex
      );
      setOptimisticColumns(updatedColumns);

      try {
        await editBoard({
          id: activeB?._id,
          updateBoard: { title: activeB?.title, columns: updatedColumns },
        }).unwrap();
        refetch();
        success("Board reorder successfully!");
      } catch (error) {
        console.error("Failed to reorder board:", error);
        errorToast("Failed to reorder board!");
        setOptimisticColumns(columns);
      }
    }
  };

  if (!activeB) {
    return <p className="text-2xl p-4 text-white">No selected board</p>;
  }
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
    <section
      className={`w-full py-4  px-8 overflow-y-hidden h-[90vh]  overflow-x [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-800  transition-all duration-300 
      ${isAsideHidden ? "-ml-[250px] w-full" : "ml-0 w-[calc(100%-250px)]"} `}>
      <h1 className="text-2xl font-semibold pb-4 text-seccondColor">
        {activeB.title}
      </h1>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {activeB && optimisticColumns && (
          <SortableContext
            items={optimisticColumns?.map((col) => col._id || "")}>
            <div className="w-full h-full text-white flex gap-8  ">
              {optimisticColumns?.map((column: Column) => (
                <ColumnItem column={column} key={column._id} board={activeB} />
              ))}
              <div
                className=" mr-12 min-w-[250px] max-w-64 bg-gray-800 p-2 rounded-lg mt-6 h-64 flex justify-center items-center text-xl font-semibold hover:text-seccondColor hover:shadow-none duration-200 cursor-pointer bg-opacity-80 shadow-lg shadow-gray-800"
                onClick={() => setModalOpen(true)}>
                + Add column
              </div>
            </div>
          </SortableContext>
        )}
      </DndContext>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddBoard
          board={activeB._id}
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
