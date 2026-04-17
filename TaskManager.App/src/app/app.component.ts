import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { ToastService } from './services/toast.service';
import { TaskModel } from './models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from './Components/create-task/create-task.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FullstackApp';
  tasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;
  isLoading = false;
  constructor(private taskService: TaskService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.getTasks();
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: TaskModel) => {
      if (result) {
        this.taskService.addTask(result).subscribe({
          next: (createdTask) => {
            this.toastService.show(`Task "${createdTask.title}" created!`, 'TaskCreated');
            this.notificationService.createNotification({
              type: 'TaskCreated',
              message: `Task "${createdTask.title}" was created.`,
            }).subscribe();
            // Optionally refresh tasks if you're on the dashboard
            if (this.router.url === '/dashboard') {
              this.getTasks?.();
            }
          },
          error: () => {
            this.toastService.show('Failed to create task.', 'error');
          }
        });
      }
    });
  }

  isLandingPage(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  isAuthPage(): boolean {
    const authPages = ['/login', '/register'];
    return authPages.includes(this.router.url) || this.isLandingPage();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        console.log('Tasks fetched:', response);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  editTask(task: TaskModel) {
    this.selectedTask = { ...task }; // Clone the task to avoid directly modifying the list
  }

  onTaskUpdated() {
    this.getTasks(); // Refresh the task list
    this.selectedTask = null; // Clear the selected task
  }

  onCancelUpdate() {
    this.selectedTask = null; // Clear the selected task
  }

  addTask() {
    const newTask: TaskModel = {
      id: '', // Supabase will assign the UUID
      title: 'New Task',
      description: 'This is a new task',
      isCompleted: false,
      createdAt: new Date(),
      priority: 'Low',
      plannedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 7)) // Default to 7 days from now
    };

    this.taskService.addTask(newTask).subscribe({
      next: (response) => {
        this.tasks.push(response);
        console.log('Task added:', response);
      },
      error: (error) => {
        console.error('Error adding task:', error);
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        console.log(`Task with ID ${id} deleted.`);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  
}