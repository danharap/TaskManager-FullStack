import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskModel } from '../../models/task.model';
import { UpdateUsernameDialogComponent } from '../update-username-dialog/update-username-dialog.component';
import { UpdateRoleDialogComponent } from '../update-role-dialog/update-role-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';

export interface ProfileUser {
  id: string;
  username: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: ProfileUser[] = [];
  tasks: TaskModel[] = [];
  isTaskView: boolean = false;
  userRole: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');

    this.route.queryParams.subscribe((params) => {
      const view = params['view'];
      this.isTaskView = view === 'tasks';
      if (this.isTaskView) {
        this.getAllTasks();
      } else {
        this.getAllUsers();
      }
    });
  }

  openUpdateUsernameDialog(user: ProfileUser) {
    const dialogRef = this.dialog.open(UpdateUsernameDialogComponent, {
      width: '400px',
      data: { user }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllUsers();
    });
  }

  openUpdateRoleDialog(user: ProfileUser) {
    const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      width: '400px',
      data: { user }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllUsers();
    });
  }

  getAllUsers() {
    this.supabaseService.client
      .from('profiles')
      .select('id, username, role')
      .then(({ data, error }) => {
        if (error) { console.error('Failed to fetch users:', error); return; }
        this.users = data ?? [];
      });
  }

  getAllTasks() {
    this.supabaseService.client
      .from('tasks')
      .select('*, subtasks(*)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { alert('Failed to fetch tasks'); return; }
        this.tasks = (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description ?? '',
          isCompleted: row.is_completed,
          priority: row.priority,
          plannedCompletionDate: row.planned_completion_date ? new Date(row.planned_completion_date) : new Date(),
          createdAt: new Date(row.created_at),
          subTasks: row.subtasks ?? []
        }));
      });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user and all their tasks?')) {
      this.supabaseService.client
        .rpc('admin_delete_user', { target_user_id: id })
        .then(({ error }) => {
          if (error) { alert('Failed to delete user: ' + error.message); return; }
          this.users = this.users.filter((u) => u.id !== id);
          alert('User deleted');
        });
    }
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.supabaseService.client
        .from('tasks')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) { alert('Failed to delete task: ' + error.message); return; }
          this.tasks = this.tasks.filter((t) => t.id !== id);
          alert('Task deleted');
        });
    }
  }
}
