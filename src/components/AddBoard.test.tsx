import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddBoard from "./AddBoard";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../redux/store";
import userEvent from "@testing-library/user-event";

describe("AddBoard form check", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const setup = () => {
    render(
      <Provider store={store}>
        <AddBoard board="test-board" onSubmit={mockOnSubmit} />
      </Provider>
    );
  };

  test("Check the form render correct", () => {
    setup();

    expect(
      screen.getByPlaceholderText("e.g. App project or Selling plan")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Planning, Shoping")
    ).toBeInTheDocument();
  });

  test("Check the validation error, empty name", async () => {
    setup();

    fireEvent.submit(screen.getByRole("button", { name: /Create Board/i }));

    await waitFor(() => {
      expect(screen.getByText("Board Name is required")).toBeInTheDocument();
    });
  });

  test("Submit form with correct values in inputs", async () => {
    setup();

    const titleInput = screen.getByPlaceholderText(
      "e.g. App project or Selling plan"
    );
    await userEvent.type(titleInput, "Website Project");

    fireEvent.submit(screen.getByRole("button", { name: /Create Board/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        boardTitle: "Website Project",
        columns: [{ _id: "", title: "" }],
      });
    });
  });

  test("Add and removes column", async () => {
    setup();
    // Dodaje COl
    fireEvent.click(screen.getByRole("button", { name: /Add new Column/i }));
    expect(
      screen.getAllByPlaceholderText("e.g. Planning, Shoping")
    ).toHaveLength(2);

    // Usuwa col
    const deleteBtn = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtn[0]);
    expect(
      screen.getAllByPlaceholderText("e.g. Planning, Shoping")
    ).toHaveLength(1);
  });

  test("Updated form values check", async () => {
    setup();

    const titleInput = screen.getByPlaceholderText(
      "e.g. App project or Selling plan"
    );
    await userEvent.type(titleInput, "Website Project");

    const columnInput = screen.getByPlaceholderText("e.g. Planning, Shoping");
    await userEvent.type(columnInput, "Planning Layout");

    fireEvent.submit(screen.getByRole("button", { name: /Create Board/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        boardTitle: "Website Project",
        columns: [{ _id: "", title: "Planning Layout" }],
      });
    });
  });
});
