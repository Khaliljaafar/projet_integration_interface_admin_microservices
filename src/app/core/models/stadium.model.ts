export interface StadiumRequestDto {
  type: string;
  name: string;
  size?: string;
  address?: string;
  reservationId?: number;
  longitude: number;
  latitude: number;
  dayReservation: string[]; // length 6 expected
}

export interface StadiumResponseDto {
  id: number;
  type: string;
  name?: string;
  size?: string;
  address?: string;
  reservationId?: number;
  longitude?: number;
  latitude?: number;
  dayReservation?: string[];
}

export interface StadiumUpdateRequestDto {
  type?: string;
  name?: string;
  size?: string;
  address?: string;
  reservationId?: number;
  longitude?: number;
  latitude?: number;
  dayReservation?: string[];
}
