import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/user';
import { AuthContext } from '../../context/auth/auth-context';

const MainPage = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (user.role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/store');
    }
  }, [navigate, isLoading, isAuthenticated, user]);

  return null;
};

export default MainPage;
