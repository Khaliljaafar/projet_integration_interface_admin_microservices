export interface MetricRequestDto {
  metricKey: string;
  scopeReference?: string;
  metricValue: number;
}

export interface MetricResponseDto {
  id: number;
  metricKey: string;
  scopeReference?: string;
  metricValue: number;
  capturedAt?: string;
}

export interface DashboardOverviewDto {
  totalReservations: number;
  activeBans: number;
  averageRating: number;
  notificationCount: number;
}
