import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { LoginRequestDto, LoginResponseDto } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly client = inject(ApiClientService);

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    // Routed through API Gateway using discovery locator
    // Gateway base is configured in api-config.ts
    return this.client.post<LoginResponseDto>('/user-access-service/api/auth/login', payload);
  }
}
