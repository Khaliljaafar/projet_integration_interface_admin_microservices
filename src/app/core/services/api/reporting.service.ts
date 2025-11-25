import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { MetricRequestDto, MetricResponseDto, DashboardOverviewDto } from '../../models/reporting.model';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  constructor(private client: ApiClientService) {}

  recordMetric(payload: MetricRequestDto): Observable<MetricResponseDto> {
    return this.client.post<MetricResponseDto>('/api/reporting/metrics', payload);
  }

  latestMetrics(metricKey: string): Observable<MetricResponseDto[]> {
    return this.client.get<MetricResponseDto[]>('/api/reporting/metrics', { metricKey });
  }

  dashboardOverview(): Observable<DashboardOverviewDto> {
    return this.client.get<DashboardOverviewDto>('/api/reporting/overview');
  }
}
