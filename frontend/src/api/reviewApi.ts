import axiosClient from './axiosClient';

export interface Review {
  id: number;
  gymId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RatingSummary {
  gymId: number;
  averageRating: number;
  totalReviews: number;
}

export const getReviews = (gymId: number) =>
  axiosClient.get<Review[]>(`/api/gyms/${gymId}/reviews`);

export const getRatingSummary = (gymId: number) =>
  axiosClient.get<RatingSummary>(`/api/gyms/${gymId}/reviews/summary`);