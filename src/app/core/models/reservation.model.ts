export interface ReservationSlotRequestDto {
  reservationMode: string; // enum name as string
  reservationOption?: string | null;
  players: string[];
}

export interface ReservationRequestDto {
  stadiumId: number;
  clientId: number;
  reservationDate: string; // ISO date
  slots: ReservationSlotRequestDto[];
  durationDays?: number;
}

export interface ReservationSlotResponseDto {
  id: number;
  reservationMode: string;
  reservationOption?: string | null;
  players: string[];
}

export interface ReservationResponseDto {
  id: number;
  stadiumId: number;
  clientId: number;
  reservationDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  slots?: ReservationSlotResponseDto[];
}

export interface ReservationStatusUpdateRequestDto {
  status: string;
}
