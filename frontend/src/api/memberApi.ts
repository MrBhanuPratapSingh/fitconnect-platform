import axiosClient from './axiosClient';

export interface Member {
  id: number;
  gymId: number;
  userId: number | null;
  fullName: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
  feePlanId: number | null;
}

export interface MemberCreateRequest {
  fullName: string;
  phone?: string;
  email?: string;
  joinDate: string;
  feePlanId?: number;
}

export interface FeePayment {
  id: number;
  memberId: number;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
}

export interface FeePaymentRequest {
  amount: number;
  dueDate: string;
}

export const getMembers = (gymId: number) =>
  axiosClient.get<Member[]>('/api/members', { headers: { 'X-Gym-Id': gymId } });

export const addMember = (gymId: number, data: MemberCreateRequest) =>
  axiosClient.post<Member>('/api/members', data, { headers: { 'X-Gym-Id': gymId } });

export const deactivateMember = (gymId: number, memberId: number) =>
  axiosClient.patch(`/api/members/${memberId}/deactivate`, {}, { headers: { 'X-Gym-Id': gymId } });

export const getPaymentsForMember = (gymId: number, memberId: number) =>
  axiosClient.get<FeePayment[]>(`/api/members/${memberId}/payments`, { headers: { 'X-Gym-Id': gymId } });

export const createDuePayment = (gymId: number, memberId: number, data: FeePaymentRequest) =>
  axiosClient.post<FeePayment>(`/api/members/${memberId}/payments`, data, { headers: { 'X-Gym-Id': gymId } });

export const markPaymentPaid = (gymId: number, paymentId: number, paidDate: string) =>
  axiosClient.patch(`/api/members/payments/${paymentId}/mark-paid`, { paidDate }, { headers: { 'X-Gym-Id': gymId } });