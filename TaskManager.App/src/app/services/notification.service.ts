import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

export interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

function mapNotification(row: any): NotificationModel {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    message: row.message,
    createdAt: row.created_at,
    isRead: row.is_read
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.client;
  }

  getNotifications(): Observable<NotificationModel[]> {
    return from(
      this.db
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(mapNotification);
      })
    );
  }

  markAsRead(id: string): Observable<NotificationModel> {
    return from(
      this.db
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return mapNotification(data);
      })
    );
  }

  deleteNotification(id: string): Observable<void> {
    return from(
      this.db.from('notifications').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  createNotification(notification: Partial<NotificationModel>): Observable<NotificationModel> {
    return new Observable(observer => {
      this.db.auth.getUser().then(({ data }) => {
        const userId = data.user?.id;
        if (!userId) { observer.error(new Error('Not authenticated')); return; }

        this.db.from('notifications').insert({
          user_id: userId,
          type: notification.type,
          message: notification.message,
          is_read: false
        }).select().single().then(({ data: row, error }) => {
          if (error) { observer.error(error); return; }
          observer.next(mapNotification(row));
          observer.complete();
        });
      });
    });
  }

  clearAllNotifications(): Observable<void> {
    return new Observable(observer => {
      this.db.auth.getUser().then(({ data }) => {
        const userId = data.user?.id;
        if (!userId) { observer.error(new Error('Not authenticated')); return; }

        this.db.from('notifications').delete().eq('user_id', userId).then(({ error }) => {
          if (error) { observer.error(error); return; }
          observer.next();
          observer.complete();
        });
      });
    });
  }
}
