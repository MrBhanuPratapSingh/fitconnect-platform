import axiosClient from './axiosClient';

export interface Review {
  id: number;
  gymId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface RatingSummary {
  gymId: number;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment: string;
}

export const getReviews = (gymId: number) =>
  axiosClient.get<Review[]>(`/api/gyms/${gymId}/reviews`);

export const getRatingSummary = (gymId: number) =>
  axiosClient.get<RatingSummary>(`/api/gyms/${gymId}/reviews/summary`);

export const updateReview = (gymId: number, userId: number, data: ReviewUpdateRequest) =>
  axiosClient.put(`/api/gyms/${gymId}/reviews`, data, { params: { userId } });

export const deleteReview = (gymId: number, userId: number) =>
  axiosClient.delete(`/api/gyms/${gymId}/reviews`, { params: { userId } });