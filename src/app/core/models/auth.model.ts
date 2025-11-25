export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  authenticated: boolean;
  message: string;
  userId?: number;
  roleId?: number;
  roleLabel?: string;
  accessToken?: string;
}
