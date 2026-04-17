export interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
