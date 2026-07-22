import axiosClient from './axiosClient';

export interface JobPost {
  id: number;
  gymId: number;
  gymName: string;
  title: string;
  description: string;
  salary: number;
  employmentType: string;
  postedDate: string;
  status: string;
  applicantCount: number;
}

export interface JobPostCreateRequest {
  gymName: string;
  gymAddress?: string;
  gymLatitude?: number;
  gymLongitude?: number;
  title: string;
  description?: string;
  salary: number;
  employmentType: string;
}

export interface JobApplication {
  id: number;
  jobPostId: number;
  jobTitle: string;
  applicantUserId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverNote: string;
  appliedDate: string;
  status: string;
}

export const getMyJobs = (gymId: number) =>
  axiosClient.get<JobPost[]>('/api/jobs/mine', { headers: { 'X-Gym-Id': gymId } });

export const createJob = (gymId: number, data: JobPostCreateRequest) =>
  axiosClient.post<JobPost>('/api/jobs', data, { headers: { 'X-Gym-Id': gymId } });

export const closeJob = (gymId: number, jobId: number) =>
  axiosClient.patch(`/api/jobs/${jobId}/close`, {}, { headers: { 'X-Gym-Id': gymId } });

export const getApplicationsForJob = (gymId: number, jobId: number) =>
  axiosClient.get<JobApplication[]>(`/api/jobs/${jobId}/applications`, { headers: { 'X-Gym-Id': gymId } });

export const updateApplicationStatus = (gymId: number, applicationId: number, status: string) =>
  axiosClient.patch(`/api/jobs/applications/${applicationId}/status`, { status }, { headers: { 'X-Gym-Id': gymId } });