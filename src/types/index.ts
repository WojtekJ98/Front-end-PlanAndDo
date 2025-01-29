export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export interface BoardState {
  boards: Board[];
  activeBoard: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  status?: "todo" | "in-progress" | "done";
  piority?: "low" | "medium" | "high";
  subTasks: SubTasks[];
}

export interface SubTasks {
  id: string;
  title: string;
}
