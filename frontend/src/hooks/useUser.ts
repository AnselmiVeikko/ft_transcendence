/* import apiClient from '../utils/apiClient';
import { useState, useEffect } from 'react';

export const useUser = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get('/api/user/profile/self');
      const { userName, userId, email, avatarUrl: rawAvatarUrl } = data.data;

      setUserName(userName);
      setUserId(userId);
      setEmail(email);

      const cleanUrl = rawAvatarUrl.replace('../frontend/public', '');
      
      setAvatarUrl(cleanUrl);
    } catch (e) {
      setUserName('');
      setUserId('');
      setEmail('');
      setAvatarUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { userName, userId, email, avatarUrl, loading, refetch: fetchUser };
}; */