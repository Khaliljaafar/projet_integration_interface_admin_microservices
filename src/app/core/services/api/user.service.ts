import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  UserRegistrationRequestDto,
  UserResponseDto,
  UserUpdateRequestDto
} from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private client: ApiClientService) {}

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    return this.client.post<LoginResponseDto>('/user-access-service/api/auth/login', payload);
  }

  register(payload: UserRegistrationRequestDto): Observable<UserResponseDto> {
    return this.client.post<UserResponseDto>('/user-access-service/api/users', payload);
  }

  list(): Observable<UserResponseDto[]> {
    return this.client.get<UserResponseDto[]>('/user-access-service/api/users');
  }

  get(id: number): Observable<UserResponseDto> {
    return this.client.get<UserResponseDto>(`/user-access-service/api/users/${id}`);
  }

  update(id: number, payload: UserUpdateRequestDto): Observable<UserResponseDto> {
    return this.client.put<UserResponseDto>(`/user-access-service/api/users/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.client.delete<void>(`/user-access-service/api/users/${id}`);
  }

  listByRole(roleId: number): Observable<UserResponseDto[]> {
    return this.client.get<UserResponseDto[]>(`/user-access-service/api/users/role/${roleId}`);
  }

  getClients(): Observable<UserResponseDto[]> {
    // Role ID 3 = Client/Joueur
    return this.listByRole(3);
  }
}
