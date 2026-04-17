import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { SubTaskModel } from '../../models/task.model';
import { Location } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-subtask-board',
  templateUrl: './subtask-board.component.html',
  styleUrls: ['./subtask-board.component.css']
})
export class SubtaskBoardComponent implements OnInit {
  taskId!: string;
  subtasks: SubTaskModel[] = [];
  editingSubtaskId: string | null = null;
  editSubtaskData: Partial<SubTaskModel> = {};
  statuses = ['To Do', 'In Progress', 'In Review', 'Complete'];
  newSubTaskTitle = '';
  viewingSubtask: SubTaskModel | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private location: Location, private notificationService: NotificationService, private toastService: ToastService ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    this.loadSubTasks();
  }

    goBack() {
    this.location.back();
  }

    startEditSubtask(subtask: SubTaskModel) {
    this.editingSubtaskId = subtask.id;
    this.editSubtaskData = { ...subtask };
  }

  cancelEditSubtask() {
    this.editingSubtaskId = null;
    this.editSubtaskData = {};
  }


viewSubtask(subtask: SubTaskModel) {
  this.viewingSubtask = subtask;
}

closeViewSubtask() {
  this.viewingSubtask = null;
}
openSubtaskDialog(subtask: SubTaskModel) {
  // Make a copy to avoid editing directly until save
  this.viewingSubtask = { ...subtask };
}

saveViewingSubtask() {
  if (!this.viewingSubtask?.title?.trim()) return;
  this.taskService.updateSubTask(this.viewingSubtask.id, this.viewingSubtask).subscribe(() => {
    this.notificationService.createNotification({
      type: 'SubTaskUpdated',
      message: `Subtask "${this.viewingSubtask?.title}" was updated.`,
    }).subscribe();
    this.toastService.show(`Subtask "${this.viewingSubtask?.title}" updated!`, 'SubTaskUpdated');
    this.viewingSubtask = null;
    this.loadSubTasks();
  });
}

  saveEditSubtask() {
    if (!this.editSubtaskData.title?.trim()) return;
    this.taskService.updateSubTask(this.editingSubtaskId!, this.editSubtaskData as SubTaskModel).subscribe(() => {
      this.editingSubtaskId = null;
      this.editSubtaskData = {};
      this.loadSubTasks();
    });
  }

  loadSubTasks() {
    this.taskService.getSubTasks(this.taskId).subscribe(subtasks => {
      this.subtasks = subtasks;
    });
  }

addSubTask() {
  if (!this.newSubTaskTitle.trim()) return;
  const subTask: SubTaskModel = {
    id: '',
    title: this.newSubTaskTitle,
    description: '',
    isCompleted: false,
    taskId: this.taskId,
    status: 'To Do'
  };
  this.taskService.addSubTask(this.taskId, subTask).subscribe((createdSubTask) => {
    this.newSubTaskTitle = '';
    this.loadSubTasks();
    this.notificationService.createNotification({
      type: 'SubTaskCreated',
      message: `Subtask "${createdSubTask.title}" was created.`,
    }).subscribe();
    this.toastService.show(`Subtask "${createdSubTask.title}" created!`, 'SubTaskCreated');
  });
}

  moveSubTask(subtask: SubTaskModel, direction: number) {
    const currentIdx = this.statuses.indexOf(subtask.status);
    const newIdx = currentIdx + direction;
    if (newIdx < 0 || newIdx >= this.statuses.length) return;
    subtask.status = this.statuses[newIdx];
    this.taskService.updateSubTask(subtask.id, subtask).subscribe(() => {
      this.loadSubTasks();
    });
  }

deleteSubTask(subtask: SubTaskModel) {
  this.taskService.deleteSubTask(subtask.id).subscribe({
    next: () => {
      this.loadSubTasks();
      this.notificationService.createNotification({
        type: 'SubTaskDeleted',
        message: `Subtask "${subtask.title}" was deleted.`,
      }).subscribe();
      this.toastService.show(`Subtask "${subtask.title}" deleted!`, 'SubTaskDeleted');
      this.closeViewSubtask(); // Close dialog if open
    },
    error: (err) => {
      this.toastService.show('Failed to delete subtask.', 'error');
    }
  });
}

    getSubtasksByStatus(status: string) {
    return this.subtasks.filter((subtask: any) => subtask.status === status);
  }

changeSubtaskStatus(subtask: SubTaskModel, newStatus: string) {
  if (subtask.status !== newStatus) {
    const oldStatus = subtask.status;
    subtask.status = newStatus;
    this.taskService.updateSubTask(subtask.id, subtask).subscribe(() => {
      this.loadSubTasks();
      this.notificationService.createNotification({
        type: 'SubTaskStatusChanged',
        message: `Subtask "${subtask.title}" status changed from "${oldStatus}" to "${newStatus}".`,
      }).subscribe();
      this.toastService.show(`Subtask "${subtask.title}" moved to "${newStatus}"!`, 'SubTaskStatusChanged');
    });
  }
}

}