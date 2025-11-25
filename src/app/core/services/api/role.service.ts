import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { RoleRequestDto, RoleResponseDto } from '../../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private client: ApiClientService) {}

  create(payload: RoleRequestDto): Observable<RoleResponseDto> {
    return this.client.post<RoleResponseDto>('/user-access-service/api/roles', payload);
  }

  list(): Observable<RoleResponseDto[]> {
    return this.client.get<RoleResponseDto[]>('/user-access-service/api/roles');
  }
}
