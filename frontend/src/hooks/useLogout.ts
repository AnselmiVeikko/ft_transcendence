import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearUserContext } = useUser();

  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearUserContext();
          navigate("/");
        }
        throw new Error("Logout failed");
      }

      const result = await response.json();
      
      if (result.message.toLowerCase().includes("succes")) {
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