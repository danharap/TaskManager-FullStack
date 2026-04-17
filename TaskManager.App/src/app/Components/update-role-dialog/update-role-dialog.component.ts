import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-update-role-dialog',
  templateUrl: './update-role-dialog.component.html',
  styleUrls: ['./update-role-dialog.component.css']
})
export class UpdateRoleDialogComponent {
  newRole: string = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: { id: string; role: string } },
    private supabaseService: SupabaseService
  ) {}

  updateRole() {
    this.supabaseService.client
      .from('profiles')
      .update({ role: this.newRole })
      .eq('id', this.data.user.id)
      .then(({ error }) => {
        if (error) {
          alert(error.message || 'Failed to update role');
          return;
        }
        alert('Role updated successfully');
        this.dialogRef.close(true);
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
