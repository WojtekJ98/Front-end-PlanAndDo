import { fireEvent, render, screen } from "@testing-library/react";
import { Task } from "../types";
import TaskItem from "../components/TaskItem";
import "@testing-library/jest-dom";

describe("Test TaskItem Component", () => {
  const task: Task = {
    _id: "1",
    title: "Test Task Item",
    description: "This is a description to test task.",
    subTasks: [
      { id: "sub1", title: "Subtask 1", done: true },
      { id: "sub2", title: "Subtask 2", done: false },
    ],
    piority: "medium",
    status: "in-progress",
    deadline: new Date("2025-02-20"),
  };

  test("renders task item correct", () => {
    render(<TaskItem task={task} onClick={() => {}} />);

    expect(screen.getByText("Test Task Item")).toBeInTheDocument();
    expect(
      screen.getByText("This is a description to test task.")
    ).toBeInTheDocument();

    expect(screen.getByText("(1 of 2)")).toBeInTheDocument();

    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("medium")).toHaveClass("text-yellow-500");
  });
  test("fires onClick event, on task click", () => {
    const mockClick = jest.fn();

    render(<TaskItem task={task} onClick={mockClick} />);

    fireEvent.click(screen.getByText("This is a description to test task."));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
