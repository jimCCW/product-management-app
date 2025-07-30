import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppNavbar from '../../components/app-bar';
import { AuthContext } from '../../context/auth/auth-context';
import { CartContext } from '../../context/cart/cart-context';
import { UserRole } from '../../types/user';

describe('AppNavbar', () => {
  const user = {
    id: '09273e55-3b29-4357-aec9-a66839e09416',
    name: 'User',
    email: 'user@mandai.com',
    role: UserRole.USER,
  };

  const logout = jest.fn();
  const clearCart = jest.fn();

  const renderWithProviders = (isStorePage = false) =>
    render(
      <AuthContext.Provider value={{ user, logout } as any}>
        <CartContext.Provider value={{ clearCart } as any}>
          <BrowserRouter>
            <AppNavbar isStorePage={isStorePage} />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with company logo', () => {
    renderWithProviders();

    expect(screen.getByAltText(/mandai logo/i)).toBeInTheDocument();
  });

  it('renders with cart icon when store page', () => {
    renderWithProviders(true);

    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('opens menu and triggers logout', () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole('button', { name: /account/i }));
    fireEvent.click(screen.getByText(/logout/i));

    expect(clearCart).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });
});
