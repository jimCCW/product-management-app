import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/auth/auth-context';
import type { UserRole } from '../types/user';

interface Props {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated || !user) return <Navigate to='/login' />;
  if (!allowedRoles.includes(user.role)) return <Navigate to='/login' />;

  return children;
};
