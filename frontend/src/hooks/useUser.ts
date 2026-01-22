import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/profile/self', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) navigate("/");
        throw new Error('Auth failed');
      }

      const result = await response.json();
      setUserName(result.data.userName);
      setUserId(result.data.userId);
    } catch (e) {
      console.error('Failed to fetch user:', e);
      setUserName('Player');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { userName, userId, loading, refetch: fetchUser };
};