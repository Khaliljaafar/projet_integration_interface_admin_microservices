export interface FeedbackRequestDto {
  clientId: number;
  stadiumId: number;
  message?: string;
  note: number;
}

export interface FeedbackResponseDto {
  id: number;
  clientId: number;
  stadiumId: number;
  message?: string;
  note: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingSummaryDto {
  stadiumId: number;
  averageNote: number;
  totalFeedbacks: number;
}

export interface FeedbackUpdateRequestDto {
  message?: string;
  note?: number;
}

export interface FeedbackVisibilityRequestDto {
  visible: boolean;
}
