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

export interface SalaryPayment {
  id: number;
  trainerId: number;
  amount: number;
  salaryMonth: string; // e.g. "2026-07"
  paidDate: string | null;
  status: string;
}

export interface SalaryPaymentRequest {
  amount: number;
  salaryMonth: string;
}

export const getTrainers = (gymId: number) =>
  axiosClient.get<Trainer[]>('/api/trainers', { headers: { 'X-Gym-Id': gymId } });

export const addTrainer = (gymId: number, data: TrainerCreateRequest) =>
  axiosClient.post<Trainer>('/api/trainers', data, { headers: { 'X-Gym-Id': gymId } });

export const deactivateTrainer = (gymId: number, trainerId: number) =>
  axiosClient.patch(`/api/trainers/${trainerId}/deactivate`, {}, { headers: { 'X-Gym-Id': gymId } });

export const getSalaryHistory = (gymId: number, trainerId: number) =>
  axiosClient.get<SalaryPayment[]>(`/api/trainers/${trainerId}/salary`, { headers: { 'X-Gym-Id': gymId } });

export const createSalary = (gymId: number, trainerId: number, data: SalaryPaymentRequest) =>
  axiosClient.post<SalaryPayment>(`/api/trainers/${trainerId}/salary`, data, { headers: { 'X-Gym-Id': gymId } });

export const markSalaryPaid = (gymId: number, paymentId: number, paidDate: string) =>
  axiosClient.patch(`/api/trainers/salary/${paymentId}/mark-paid`, { paidDate }, { headers: { 'X-Gym-Id': gymId } });