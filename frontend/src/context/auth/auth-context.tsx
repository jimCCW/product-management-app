import { createContext } from 'react';
import type { UserInfo } from '../../types/user';

type AuthContextType = {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
