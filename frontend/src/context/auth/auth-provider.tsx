import { useEffect, useState, type FC, type ReactNode } from 'react';
import { UserRole, type UserInfo } from '../../types/user';
import { authAPI } from '../../services/api';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      getUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to retrieve user profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message);
      }

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      if (userData.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/store');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
