export interface NotificationResponseDto {
  id: number;
  stadiumId?: number;
  userReferenceId?: number;
  message?: string;
  createdAt?: string;
  read?: boolean;
}

export interface AdminNotificationRequestDto {
  stadiumId: number;
  clientId: number;
  message: string;
}

export interface ClientNotificationRequestDto {
  stadiumId?: number;
  message: string;
}

export interface SuperAdminNotificationRequestDto {
  stadiumId: number;
  adminId: number;
  message: string;
}
