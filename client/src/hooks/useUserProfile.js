import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useUserProfile = (options = {}) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
