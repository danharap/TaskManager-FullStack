import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { TaskModel, SubTaskModel } from '../models/task.model';

function mapTask(row: any): TaskModel {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    isCompleted: row.is_completed,
    priority: row.priority ?? 'Medium',
    plannedCompletionDate: row.planned_completion_date
      ? new Date(row.planned_completion_date)
      : new Date(),
    createdAt: new Date(row.created_at),
    subTasks: (row.subtasks ?? []).map(mapSubTask)
  };
}

function mapSubTask(row: any): SubTaskModel {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    isCompleted: row.is_completed,
    taskId: row.task_id,
    status: row.status ?? 'To Do'
  };
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksChangedSource = new Subject<void>();
  tasksChanged$ = this.tasksChangedSource.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.client;
  }

  notifyTasksChanged() {
    this.tasksChangedSource.next();
  }

  getTasks(): Observable<TaskModel[]> {
    return from(
      this.db
        .from('tasks')
        .select('*, subtasks(*)')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(mapTask);
      })
    );
  }

  getTaskById(id: string): Observable<TaskModel> {
    return from(
      this.db.from('tasks').select('*, subtasks(*)').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return mapTask(data);
      })
    );
  }

  addTask(task: Partial<TaskModel>): Observable<TaskModel> {
    return new Observable(observer => {
      this.db.auth.getUser().then(({ data }) => {
        const userId = data.user?.id;
        if (!userId) { observer.error(new Error('Not authenticated')); return; }

        this.db.from('tasks').insert({
          user_id: userId,
          title: task.title,
          description: task.description ?? '',
          is_completed: task.isCompleted ?? false,
          priority: task.priority ?? 'Medium',
          planned_completion_date: task.plannedCompletionDate ?? null
        }).select().single().then(({ data: row, error }) => {
          if (error) { observer.error(error); return; }
          observer.next(mapTask(row));
          observer.complete();
          this.notifyTasksChanged();
        });
      });
    });
  }

  updateTask(id: string, task: Partial<TaskModel>): Observable<TaskModel> {
    return from(
      this.db.from('tasks').update({
        title: task.title,
        description: task.description,
        is_completed: task.isCompleted,
        priority: task.priority,
        planned_completion_date: task.plannedCompletionDate ?? null,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return mapTask(data);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return from(this.db.from('tasks').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  getAllTasks(_token: string | null = null): Observable<TaskModel[]> {
    return this.getTasks();
  }

  getSubTasks(taskId: string): Observable<SubTaskModel[]> {
    return from(
      this.db.from('subtasks').select('*').eq('task_id', taskId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(mapSubTask);
      })
    );
  }

  addSubTask(taskId: string, subTask: Partial<SubTaskModel>): Observable<SubTaskModel> {
    return from(
      this.db.from('subtasks').insert({
        task_id: taskId,
        title: subTask.title,
        description: subTask.description ?? '',
        is_completed: subTask.isCompleted ?? false,
        status: subTask.status ?? 'To Do'
      }).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return mapSubTask(data);
      })
    );
  }

  updateSubTask(subTaskId: string, subTask: Partial<SubTaskModel>): Observable<SubTaskModel> {
    return from(
      this.db.from('subtasks').update({
        title: subTask.title,
        description: subTask.description,
        is_completed: subTask.isCompleted,
        status: subTask.status
      }).eq('id', subTaskId).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return mapSubTask(data);
      })
    );
  }

  deleteSubTask(subTaskId: string): Observable<void> {
    return from(this.db.from('subtasks').delete().eq('id', subTaskId)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
