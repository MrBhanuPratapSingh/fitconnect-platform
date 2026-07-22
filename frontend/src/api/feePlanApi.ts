import axiosClient from './axiosClient';

export interface FeePlan {
  id: number;
  planName: string;
  amount: number;
  billingCycle: string;
}

export interface FeePlanRequest {
  planName: string;
  amount: number;
  billingCycle: string;
}

export const addFeePlan = (data: FeePlanRequest) =>
  axiosClient.post('/api/gyms/me/fee-plans', data);

export const deleteFeePlan = (feePlanId: number) =>
  axiosClient.delete(`/api/gyms/me/fee-plans/${feePlanId}`);