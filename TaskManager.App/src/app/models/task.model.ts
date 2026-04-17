export interface SubTaskModel {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  taskId: string;
  status: string;
}

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  priority: string;
  plannedCompletionDate: Date;
  subTasks?: SubTaskModel[];
}
