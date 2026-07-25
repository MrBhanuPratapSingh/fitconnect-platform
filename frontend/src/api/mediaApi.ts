import axiosClient from './axiosClient';

export interface MediaItem {
  id: number;
  url: string;
  type: string;
  isCover: boolean;
  displayOrder: number | null;
}

export const uploadMedia = (file: File, type: 'PHOTO' | 'VIDEO', isCover: boolean) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('isCover', String(isCover));

  return axiosClient.post('/api/gyms/me/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteMedia = (mediaId: number) =>
  axiosClient.delete(`/api/gyms/me/media/${mediaId}`);