import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from './services/task.service';
import { TaskModel } from './models/task.model';

/**
 * Thin delegation layer kept for backward compatibility.
 * Components that previously imported DataService continue to work;
 * all logic is now handled by TaskService + Supabase.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private taskService: TaskService) {}

  getTasks(): Observable<TaskModel[]> {
    return this.taskService.getTasks();
  }

  getTaskById(id: string): Observable<TaskModel> {
    return this.taskService.getTaskById(id);
  }

  addTask(task: Partial<TaskModel>): Observable<TaskModel> {
    return this.taskService.addTask(task);
  }

  updateTask(id: string, task: Partial<TaskModel>): Observable<TaskModel> {
    return this.taskService.updateTask(id, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.taskService.deleteTask(id);
  }
}
