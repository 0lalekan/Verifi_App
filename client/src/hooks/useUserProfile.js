import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUserProfile = (options = {}) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
