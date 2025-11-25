import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  FeedbackRequestDto,
  FeedbackResponseDto,
  FeedbackUpdateRequestDto,
  FeedbackVisibilityRequestDto,
  RatingSummaryDto
} from '../../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private client: ApiClientService) {}

  create(payload: FeedbackRequestDto): Observable<FeedbackResponseDto> {
    return this.client.post<FeedbackResponseDto>('/api/feedback', payload);
  }

  update(feedbackId: number, payload: FeedbackUpdateRequestDto): Observable<FeedbackResponseDto> {
    return this.client.put<FeedbackResponseDto>(`/api/feedback/${feedbackId}`, payload);
  }

  updateVisibility(feedbackId: number, payload: FeedbackVisibilityRequestDto): Observable<FeedbackResponseDto> {
    return this.client.put<FeedbackResponseDto>(`/api/feedback/${feedbackId}/visibility`, payload);
  }

  get(feedbackId: number): Observable<FeedbackResponseDto> {
    return this.client.get<FeedbackResponseDto>(`/api/feedback/${feedbackId}`);
  }

  list(params?: { stadiumId?: number; clientId?: number; visible?: boolean }): Observable<FeedbackResponseDto[]> {
    return this.client.get<FeedbackResponseDto[]>('/api/feedback', params as any);
  }

  getRatingSummary(stadiumId: number): Observable<RatingSummaryDto> {
    return this.client.get<RatingSummaryDto>(`/api/feedback/stadium/${stadiumId}/summary`);
  }

  delete(feedbackId: number): Observable<void> {
    return this.client.delete<void>(`/api/feedback/${feedbackId}`);
  }
}
