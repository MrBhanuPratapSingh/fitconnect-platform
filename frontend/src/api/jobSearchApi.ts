import axiosClient from './axiosClient';

export interface JobPostPublic {
  id: number;
  gymId: number;
  gymName: string;
  gymAddress: string;
  gymLatitude: number | null;
  gymLongitude: number | null;
  title: string;
  description: string;
  salary: number;
  employmentType: string;
  postedDate: string;
  status: string;
  applicantCount: number;
}

export interface JobApplicationRequest {
  applicantUserId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  coverNote?: string;
}

export interface MyApplication {
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

export const searchJobs = (keyword?: string) =>
  axiosClient.get<JobPostPublic[]>('/api/public/jobs', { params: { keyword } });

export const applyToJob = (jobId: number, data: JobApplicationRequest) =>
  axiosClient.post(`/api/jobs/${jobId}/apply`, data);

export const getMyApplications = (applicantUserId: number) =>
  axiosClient.get<MyApplication[]>('/api/jobs/applications/mine', { params: { applicantUserId } });