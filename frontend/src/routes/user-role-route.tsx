import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth/auth-context';
import { UserRole } from '../types/user';

const UserRoleRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // If logged in, redirect based on role
  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === UserRole.ADMIN ? '/admin' : '/store'}
        replace
      />
    );
  }

  return children;
};

export default UserRoleRoute;
