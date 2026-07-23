import axiosClient from './axiosClient';

export interface GymSearchResult {
  id: number;
  name: string;
  address: string;
  distanceKm: number | null;
  lowestFee: number | null;
  averageRating: number;
  totalReviews: number;
}

export interface SearchParams {
  keyword?: string;
  lat?: number;
  lng?: number;
  maxFee?: number;
  minRating?: number;
  sortBy?: 'distance' | 'fee' | 'rating';
}

export const searchGyms = (params: SearchParams) =>
  axiosClient.get<GymSearchResult[]>('/api/search/gyms', { params });