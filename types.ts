
export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: string;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
}

export interface BoardState {
  columns: Column[];
  tasks: Task[];
}
