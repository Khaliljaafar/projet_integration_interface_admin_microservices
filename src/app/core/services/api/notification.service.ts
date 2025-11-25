import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  AdminNotificationRequestDto,
  ClientNotificationRequestDto,
  SuperAdminNotificationRequestDto,
  NotificationResponseDto
} from '../../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private client: ApiClientService) {}

  sendAdmin(payload: AdminNotificationRequestDto): Observable<NotificationResponseDto> {
    return this.client.post<NotificationResponseDto>('/api/notifications/admin', payload);
  }

  sendClient(payload: ClientNotificationRequestDto): Observable<NotificationResponseDto> {
    return this.client.post<NotificationResponseDto>('/api/notifications/client', payload);
  }

  sendSuperAdmin(payload: SuperAdminNotificationRequestDto): Observable<NotificationResponseDto> {
    return this.client.post<NotificationResponseDto>('/api/notifications/super-admin', payload);
  }

  markClientRead(notificationId: number): Observable<NotificationResponseDto> {
    return this.client.put<NotificationResponseDto>(`/api/notifications/client/${notificationId}/read`, null as any);
  }

  listAdmin(stadiumId?: number, clientId?: number): Observable<NotificationResponseDto[]> {
    return this.client.get<NotificationResponseDto[]>('/api/notifications/admin', { stadiumId, clientId });
  }

  listClient(unread?: boolean): Observable<NotificationResponseDto[]> {
    return this.client.get<NotificationResponseDto[]>('/api/notifications/client', { unread });
  }

  listSuperAdmin(adminId?: number): Observable<NotificationResponseDto[]> {
    return this.client.get<NotificationResponseDto[]>('/api/notifications/super-admin', { adminId });
  }
}
