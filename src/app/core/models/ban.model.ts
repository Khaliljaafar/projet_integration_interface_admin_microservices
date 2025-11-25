export interface BanRequestDto {
  clientId: number;
  durationDays: number;
  reason: string;
  startDate?: string; // ISO date
}

export interface BanResponseDto {
  id: number;
  clientId: number;
  reason: string;
  durationDays: number;
  banStart?: string;
  banEnd?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BanUpdateRequestDto {
  durationDays?: number;
  reason?: string;
  startDate?: string;
}
