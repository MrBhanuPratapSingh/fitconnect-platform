import axiosClient from './axiosClient';

export interface Trainer {
  id: number;
  gymId: number;
  userId: number | null;
  fullName: string;
  phone: string;
  email: string;
  specialization: string;
  experienceYears: number | null;
  shiftTiming: string;
  joinDate: string;
  status: string;
}

export interface TrainerCreateRequest {
  fullName: string;
  phone?: string;
  email?: string;
  specialization?: string;
  experienceYears?: number;
  shiftTiming?: string;
  joinDate: string;
}

export const getTrainers = (gymId: number) =>
  axiosClient.get<Trainer[]>('/api/trainers', { headers: { 'X-Gym-Id': gymId } });

export const addTrainer = (gymId: number, data: TrainerCreateRequest) =>
  axiosClient.post<Trainer>('/api/trainers', data, { headers: { 'X-Gym-Id': gymId } });

export const deactivateTrainer = (gymId: number, trainerId: number) =>
  axiosClient.patch(`/api/trainers/${trainerId}/deactivate`, {}, { headers: { 'X-Gym-Id': gymId } });