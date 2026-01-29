import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) navigate("/");
        throw new Error("Logout failed");
      }

      const result = await response.json();
      if (result.message === "Logout succesful" || result.message === "Logout successful") {
        navigate("/");
      }
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };
  return { logout };
};