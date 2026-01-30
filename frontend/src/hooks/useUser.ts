import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const useUser = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [avatarURL, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get('/api/user/profile/self');
      const { userName, userId, email, avatarName } = data.data;
      setUserName(userName);
      setUserId(userId);
      setEmail(email);

	  const newURL = avatarName ? `/avatars/upload/${avatarName}?t=${Date.now()}` 
        : '/avatars/default/default.webp';

	  setAvatar(newURL);
    } catch (e) {
      setUserName('');
      setUserId('');
      setEmail('');
	  setAvatar('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { userName, userId, loading, email, avatarURL, refetch: fetchUser };
};
