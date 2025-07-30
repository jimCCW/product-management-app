import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../../context/auth/auth-context';
import { CartContext } from '../../../context/cart/cart-context';
import ProductDetailPage from '../../../pages/store/product-detail';
import { useProductsById } from '../../../hooks/product/useQueryProducts';
import '@testing-library/jest-dom';
import { UserRole } from '../../../types/user';

jest.mock('../../../hooks/product/useQueryProducts', () => ({
  useProductsById: jest.fn(),
}));

const mockAddToCart = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '7a299a45-1f0d-47dc-987f-c1a13b19df88' }),
  useNavigate: () => mockNavigate,
}));

describe('Product Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProductPage = (
    product: any,
    user: any = {
      id: '09273e55-3b29-4357-aec9-a66839e09416',
      role: UserRole.USER,
    }
  ) => {
    (useProductsById as jest.Mock).mockReturnValue({
      data: { success: true, data: product },
      isLoading: false,
    });

    render(
      <AuthContext.Provider value={{ user } as any}>
        <CartContext.Provider value={{ addToCart: mockAddToCart } as any}>
          <MemoryRouter
            initialEntries={[
              '/store/product/7a299a45-1f0d-47dc-987f-c1a13b19df88',
            ]}
          >
            <Routes>
              <Route
                path='/store/product/:productId'
                element={<ProductDetailPage />}
              />
            </Routes>
          </MemoryRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('renders product details', () => {
    renderProductPage({
      id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
      name: 'CC Hatchday Kids T-Shirt',
      price: 25,
      stock: 10,
      description: 'Test description',
      imageUrl: '/products/product2.png',
    });

    expect(screen.getByText(/CC Hatchday Kids T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25/)).toBeInTheDocument();
    expect(screen.getByText(/Test description/i)).toBeInTheDocument();
  });

  it('disables button when stock is 0', () => {
    renderProductPage({
      id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
      name: 'CC Hatchday Kids T-Shirt',
      price: 25,
      stock: 0,
      description: 'Test description',
      imageUrl: '/products/product2.png',
    });

    expect(
      screen.getByRole('button', { name: /Out Of Stock/i })
    ).toBeDisabled();
  });

  it('redirects to login if user is not logged in', () => {
    renderProductPage(
      {
        id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
        name: 'CC Hatchday Kids T-Shirt',
        price: 25,
        stock: 10,
        description: 'Test description',
        imageUrl: '/products/product2.png',
      },
      null
    );

    const button = screen.getByRole('button', { name: /Add to Cart/i });
    button.click();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
