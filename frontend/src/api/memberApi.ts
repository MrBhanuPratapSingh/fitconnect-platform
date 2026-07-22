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

export const getMembers = (gymId: number) =>
  axiosClient.get<Member[]>('/api/members', { headers: { 'X-Gym-Id': gymId } });

export const addMember = (gymId: number, data: MemberCreateRequest) =>
  axiosClient.post<Member>('/api/members', data, { headers: { 'X-Gym-Id': gymId } });

export const deactivateMember = (gymId: number, memberId: number) =>
  axiosClient.patch(`/api/members/${memberId}/deactivate`, {}, { headers: { 'X-Gym-Id': gymId } });