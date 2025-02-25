import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useSelector } from "react-redux";
import AddTaskHandler from "./AddTask";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("../redux/selectors/selectActiveBoard", () => ({
  selectActiveBoard: jest.fn(),
}));

jest.mock("../redux/slices/boardSlice", () => ({
  useAddTaskMutation: jest.fn(),
  useGetBoardQuery: jest.fn(),
  useGetColumnsQuery: jest.fn(),
}));

describe("AddTask form check", () => {
  const mockStore = configureStore([]);
  let store: any;

  beforeEach(() => {
    store = mockStore({
      board: { activeBoard: "mockBoardId" }, // ✅ Fake Redux state
    });
    const { useSelector } = require("react-redux");
    useSelector.mockImplementation(() => "mockBoardId");

    const {
      useAddTaskMutation,
      useGetBoardQuery,
      useGetColumnsQuery,
    } = require("../redux/slices/boardSlice");

    useAddTaskMutation.mockReturnValue([jest.fn()]);

    useGetBoardQuery.mockReturnValue({
      data: { _id: "mockBoardId" },
      isLoading: false,
      error: null,
    });
    useGetColumnsQuery.mockReturnValue({
      data: [
        { _id: "mockColumnId1", title: "To Do" },
        { _id: "mockColumnId2", title: "In Progress" },
      ],
      isLoading: false,
      error: null,
    });
  });
  const setup = () => {
    render(
      <Provider store={store}>
        <AddTaskHandler onClose={() => {}} refetchTasks={() => {}} />
      </Provider>
    );
  };

  test("Check the form is render correct", () => {
    setup();

    expect(
      screen.getByPlaceholderText("e.g. Planing the header section")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Add a Logo and the Nav")
    ).toBeInTheDocument();
  });
  test("Check the validation error, empty name", async () => {
    setup();

    fireEvent.submit(screen.getByRole("button", { name: /Create Task/i }));

    await waitFor(() => {
      expect(screen.getByText("Task name is required")).toBeInTheDocument();
    });
  });
  test("Submit form with correct values in inputs", async () => {
    setup();

    const columnSelect = screen.getByLabelText("Assign to Column");
    expect(columnSelect).toBeInTheDocument();

    await userEvent.selectOptions(columnSelect, "mockColumnId1");

    const nameInput = screen.getByPlaceholderText(
      "e.g. Planing the header section"
    );
    await userEvent.type(nameInput, "Header section");

    const descriptionInput = screen.getByPlaceholderText(
      "e.g. Planing the header section"
    );
    await userEvent.type(descriptionInput, "Planing header section of website");

    fireEvent.submit(screen.getByRole("button", { name: /Create Task/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Task name is required")
      ).not.toBeInTheDocument();
    });
    expect(
      require("../redux/slices/boardSlice").useAddTaskMutation
    ).toHaveBeenCalled();
  });
});
