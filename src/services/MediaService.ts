import { BaseApiService } from './BaseApiService';
import type { ApiResponse } from '../types/api';

export interface MediaUploadResponse {
  savedFileId: number;
}

export interface MediaUploadRequest {
  file: File;
  workoutId?: number;
}

export interface FileUrlResponse {
  data: string;
}

export class MediaService extends BaseApiService {
  async uploadMedia(request: MediaUploadRequest): Promise<ApiResponse<MediaUploadResponse>> {
    const formData = new FormData();
    formData.append('file', request.file);
    
    return this.uploadFile<MediaUploadResponse>('/api/dashboard/files/upload/audio', formData);
  }

  async getFileUrl(fileId: number): Promise<ApiResponse<string>> {
    return this.get<string>(`/api/dashboard/files/url?fileId=${fileId}`);
  }
}
