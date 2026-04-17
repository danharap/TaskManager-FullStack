import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {
  task: TaskModel;
  isNewTask: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.task) {
      this.task = { ...data.task }; // Clone the task to avoid modifying the original directly
    } else {
      this.isNewTask = true;
      this.task = {
        id: '',
        title: '',
        description: '',
        priority: 'Medium',
        isCompleted: false,
        createdAt: new Date(),
        plannedCompletionDate: data.plannedCompletionDate || new Date() // Keep as Date
      };
    }
  }

  // Getter and Setter for plannedCompletionDate
  get formattedPlannedCompletionDate(): string {
    const date = this.task.plannedCompletionDate;
    return date instanceof Date
      ? date.toISOString().split('T')[0] // Convert Date to yyyy-MM-dd
      : date;
  }

  set formattedPlannedCompletionDate(value: string) {
    this.task.plannedCompletionDate = new Date(value); // Convert yyyy-MM-dd to Date
  }

  saveTask(): void {
    this.dialogRef.close(this.task); // Pass the task back to the parent
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}