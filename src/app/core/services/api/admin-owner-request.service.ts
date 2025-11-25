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

@Injectable({ providedIn: 'root' })
export class AdminOwnerRequestApiService {
  constructor(private client: ApiClientService) {}

  createWithStadium(payload: AdminOwnerCreateRequestDto): Observable<AdminOwnerResponseDto> {
    return this.client.post<AdminOwnerResponseDto>('/api/owner-requests/create-with-stadium', payload);
  }

  list(params?: Record<string, any>): Observable<AdminOwnerResponseDto[]> {
    return this.client.get<AdminOwnerResponseDto[]>('/api/owner-requests', params);
  }

  listPending(): Observable<AdminOwnerResponseDto[]> {
    return this.client.get<AdminOwnerResponseDto[]>('/api/owner-requests/pending');
  }

  updateStatus(requestId: number, status: string): Observable<AdminOwnerResponseDto> {
    return this.client.put<AdminOwnerResponseDto>(`/api/owner-requests/${requestId}/status`, { status });
  }
}
