import axiosClient from './axiosClient';

export interface Gym {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  openingTime: string | null;
  closingTime: string | null;
  contactPhone: string;
  contactEmail: string;
  establishedYear: number | null;
  media: any[];
  feePlans: any[];
  achievements: any[];
}

export interface GymCreateRequest {
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
  contactPhone?: string;
  contactEmail?: string;
  establishedYear?: number;
}

export const getMyGym = () => axiosClient.get<Gym>('/api/gyms/me');

export const createGym = (data: GymCreateRequest) => axiosClient.post<Gym>('/api/gyms', data);

export const updateGym = (data: GymCreateRequest) => axiosClient.put<Gym>('/api/gyms/me', data);