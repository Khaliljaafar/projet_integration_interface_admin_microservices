export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  authenticated: boolean;
  message?: string;
  userId?: number;
  roleId?: number;
  roleLabel?: string;
}

export interface UserRegistrationRequestDto {
  username: string;
  password: string;
  roleId: number;
  firstName: string;
  secondName: string;
  age?: number;
  address?: string;
  phoneNumber?: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  firstName: string;
  secondName: string;
  age?: number;
  address?: string;
  phoneNumber?: string;
  banned: boolean;
  roleId?: number;
  roleLabel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserUpdateRequestDto {
  firstName?: string;
  secondName?: string;
  age?: number;
  address?: string;
  phoneNumber?: string;
  banned?: boolean;
  roleId?: number;
}
