import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { StadiumRequestDto, StadiumResponseDto, StadiumUpdateRequestDto } from '../../models/stadium.model';

@Injectable({ providedIn: 'root' })
export class StadiumService {
  constructor(private client: ApiClientService) {}

  create(payload: StadiumRequestDto): Observable<StadiumResponseDto> {
    return this.client.post<StadiumResponseDto>('/api/stadiums', payload);
  }

  update(id: number, payload: StadiumUpdateRequestDto): Observable<StadiumResponseDto> {
    return this.client.put<StadiumResponseDto>(`/api/stadiums/${id}`, payload);
  }

  list(type?: string): Observable<StadiumResponseDto[]> {
    return this.client.get<StadiumResponseDto[]>('/api/stadiums', { type });
  }

  get(id: number): Observable<StadiumResponseDto> {
    return this.client.get<StadiumResponseDto>(`/api/stadiums/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.client.delete<void>(`/api/stadiums/${id}`);
  }
}
