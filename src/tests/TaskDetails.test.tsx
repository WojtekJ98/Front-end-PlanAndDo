import { render, screen } from "@testing-library/react";
import { Task } from "../types";
import TaskDetails from "../components/TaskDetails";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("Test Task Details Component", () => {
  const task: Task = {
    _id: "1",
    title: "Test Task Item",
    description: "This is a description to test task.",
    subTasks: [
      { id: "sub1", title: "Subtask 1", done: true },
      { id: "sub2", title: "Subtask 2", done: false },
    ],
    piority: "high",
    status: "in-progress",
    deadline: new Date("2025-02-20"),
  };
  const columnId: string = "id1";

  test("Check rendres of task details", () => {
    render(
      <Provider store={store}>
        <TaskDetails task={task} columnId={columnId} close={() => {}} />
      </Provider>
    );

    expect(screen.getByText("Test Task Item")).toBeInTheDocument();
    expect(screen.getByText("Subtask 1")).toBeInTheDocument();
    expect(screen.getByText("high")).toHaveClass("text-red-500");
    expect(screen.getByText("20.02.2025")).toHaveClass("text-yellow-500");
  });
});
