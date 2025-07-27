import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/login';
import AdminDashboardPage from '../pages/admin/admin-dashboard';
import StorePage from '../pages/store/store';
import { ProtectedRoute } from './protected-route';
import MainPage from '../pages/main/main';
import UserRoleRoute from './user-role-route';
import SignUpPage from '../pages/auth/signup';
import ProductDetailPage from '../pages/store/product-detail';
import StoreLayout from '../pages/store/store-layout';
import CartPage from '../pages/cart/cart';
import { UserRole } from '../types/user';

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={<MainPage />}
      />
      <Route
        path='/login'
        element={
          <UserRoleRoute>
            <LoginPage />
          </UserRoleRoute>
        }
      />
      <Route
        path='/signup'
        element={
          <UserRoleRoute>
            <SignUpPage />
          </UserRoleRoute>
        }
      />
      <Route
        path='/admin'
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/store'
        element={<StoreLayout />}
      >
        <Route
          index
          element={<StorePage />}
        />
        <Route
          path='product/:productId'
          element={<ProductDetailPage />}
        />
        <Route
          path='cart'
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.USER]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path='*'
        element={<Navigate to='/' />}
      />
    </Routes>
  );
};

export default AppRouter;
