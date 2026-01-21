import { useMutation } from '@tanstack/react-query';
import { uploadFiles } from '../api';

export function useUpload() {
  return useMutation({
    mutationFn: uploadFiles,
  });
}
