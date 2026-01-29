import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const useUser = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);


  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get('/api/user/profile/self');
      const { userName, userId, email } = data.data;
      setUserName(userName);
      setUserId(userId);
      setEmail(email);
    } catch (e) {
      //console.error('Failed to fetch user:', e);
      setUserName('');
      setUserId('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { userName, userId, loading, email, refetch: fetchUser };
};
