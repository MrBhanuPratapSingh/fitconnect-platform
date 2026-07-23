import axiosClient from './axiosClient';
import type { GymPublicResponse } from '../types/gym';

export const getPublicGym = (gymId: number) =>
  axiosClient.get<GymPublicResponse>(`/api/public/gyms/${gymId}`);