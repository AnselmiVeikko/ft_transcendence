import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import apiClient from '../utils/apiClient';
import axios from 'axios';

interface UserData {
  userName: string;
  userId: string;
  email: string;
  avatarUrl: string;
}

interface UserContextType extends UserData {
  loading: boolean;
  refetch: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const initialState: UserData = {
    userName: '',
    userId: '',
    email: '',
    avatarUrl: '',
  };

  const [user, setUser] = useState<UserData>(initialState);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(initialState);
  }, []);

  const fetchUser = useCallback(async () => {
    const hasLoggedInCookie = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('isLoggedIn='));

    if (!hasLoggedInCookie) {
      console.log('No LoggedInCookie found. Initializing guest mode');
      setLoading(false);
      return;
    }
    try {
      const { data } = await apiClient.get('/api/user/profile/self');
      const { userName, userId, email, avatarUrl } = data.data;

      setUser({
        userName,
        userId,
        email,
        avatarUrl,
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setUser(initialState);
      } else {
        console.error('Unexpected user fetch error:', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ ...user, loading, refetch: fetchUser, logout }}
    >
      <div
        className={`transition-opacity duration-300 ${loading ? 'opacity-70' : 'opacity-100'}`}
      >
        {children}
      </div>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
