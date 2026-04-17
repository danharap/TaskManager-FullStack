import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: TaskModel[] = [];
  @Input() searchQuery: string = '';
  @Output() editTask = new EventEmitter<TaskModel>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() viewSubTasks = new EventEmitter<TaskModel>();

  get filteredTasks() {
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

onEditTask(task: TaskModel) {
  this.editTask.emit(task);
}

  onDeleteTask(id: string) {
    this.deleteTask.emit(id);
  }
}