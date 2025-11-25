export interface RoleRequestDto {
  label: string;
  description?: string;
}

export interface RoleResponseDto {
  id: number;
  label: string;
  description?: string;
}
