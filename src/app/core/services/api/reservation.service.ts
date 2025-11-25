import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  ReservationRequestDto,
  ReservationResponseDto,
  ReservationStatusUpdateRequestDto
} from '../../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private client: ApiClientService) {}

  create(payload: ReservationRequestDto): Observable<ReservationResponseDto> {
    return this.client.post<ReservationResponseDto>('/api/reservations', payload);
  }

  updateStatus(reservationId: number, payload: ReservationStatusUpdateRequestDto): Observable<ReservationResponseDto> {
    return this.client.put<ReservationResponseDto>(`/api/reservations/${reservationId}/status`, payload);
  }

  get(reservationId: number): Observable<ReservationResponseDto> {
    return this.client.get<ReservationResponseDto>(`/api/reservations/${reservationId}`);
  }

  browse(params?: { clientId?: number; stadiumId?: number; date?: string; status?: string }) {
    return this.client.get<ReservationResponseDto[]>('/api/reservations', params);
  }

  delete(reservationId: number): Observable<void> {
    return this.client.delete<void>(`/api/reservations/${reservationId}`);
  }
}
