import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { BanRequestDto, BanResponseDto, BanUpdateRequestDto } from '../../models/ban.model';

@Injectable({ providedIn: 'root' })
export class BanService {
  constructor(private client: ApiClientService) {}

  create(payload: BanRequestDto): Observable<BanResponseDto> {
    return this.client.post<BanResponseDto>('/api/bans', payload);
  }

  update(banId: number, payload: BanUpdateRequestDto): Observable<BanResponseDto> {
    return this.client.put<BanResponseDto>(`/api/bans/${banId}`, payload);
  }

  delete(banId: number): Observable<void> {
    return this.client.delete<void>(`/api/bans/${banId}`);
  }

  get(banId: number): Observable<BanResponseDto> {
    return this.client.get<BanResponseDto>(`/api/bans/${banId}`);
  }

  list(params?: { clientId?: number; active?: boolean }): Observable<BanResponseDto[]> {
    return this.client.get<BanResponseDto[]>('/api/bans', params as any);
  }
}
