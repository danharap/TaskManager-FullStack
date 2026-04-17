import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-update-username-dialog',
  templateUrl: './update-username-dialog.component.html',
  styleUrls: ['./update-username-dialog.component.css']
})
export class UpdateUsernameDialogComponent {
  newUsername: string = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: { id: string; username: string } },
    private supabaseService: SupabaseService
  ) {}

  updateUsername() {
    this.supabaseService.client
      .from('profiles')
      .update({ username: this.newUsername })
      .eq('id', this.data.user.id)
      .then(({ error }) => {
        if (error) {
          alert(error.message || 'Failed to update username');
          return;
        }
        alert('Username updated successfully');
        this.dialogRef.close(true);
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
