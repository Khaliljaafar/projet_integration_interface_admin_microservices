import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface AdminOwnerCreateRequestDto {
  userId: number;
  adminId: number;
  type: string;
  name: string;
  size?: string;
  address?: string;
  reservationId?: number;
  longitude: number;
  latitude: number;
  dayReservation: string[];
}

export interface AdminOwnerResponseDto {
  id: number;
  userId: number;
  adminId: number;
  stadiumId: number;
  feedbackId?: number;
  status: string;
  createdAt: string;
}

export interface AdminOwnerSimpleCreateDto {
  userId: number;
  adminId?: number | null;
  stadiumId?: number | null;
  feedbackId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class AdminOwnerRequestApiService {
  constructor(private client: ApiClientService) {}

  createWithStadium(payload: AdminOwnerCreateRequestDto): Observable<AdminOwnerResponseDto> {
    // Backend exposes POST /api/owner-requests (no /create-with-stadium path)
    return this.client.post<AdminOwnerResponseDto>('/stadium-management-service/api/owner-requests', payload);
  }

  submit(payload: AdminOwnerSimpleCreateDto): Observable<AdminOwnerResponseDto> {
    return this.client.post<AdminOwnerResponseDto>('/stadium-management-service/api/owner-requests', payload);
  }

  list(params?: Record<string, any>): Observable<AdminOwnerResponseDto[]> {
    return this.client.get<AdminOwnerResponseDto[]>('/stadium-management-service/api/owner-requests', params);
  }

  listPending(): Observable<AdminOwnerResponseDto[]> {
    return this.client.get<AdminOwnerResponseDto[]>('/stadium-management-service/api/owner-requests', { status: 'PENDING' });
  }

  updateStatus(requestId: number, status: string): Observable<AdminOwnerResponseDto> {
    return this.client.put<AdminOwnerResponseDto>(`/stadium-management-service/api/owner-requests/${requestId}/status`, { status });
  }
}
