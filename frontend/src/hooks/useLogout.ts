import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import apiClient from '../utils/apiClient';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearUserContext } = useUser();

  const logout = async () => {
    try {
      const response = await apiClient.post('/api/user/logout');
      
      if (response.data?.message?.toLowerCase().includes("success")) {
        clearUserContext();
        navigate("/");
      }
    } catch (e) {
      console.error('Failed to logout:', e);
      clearUserContext();
      navigate("/");
    }
  };

  return { logout };
};