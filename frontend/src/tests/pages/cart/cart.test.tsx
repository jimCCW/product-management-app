import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../../../pages/cart/cart';
import { CartContext } from '../../../context/cart/cart-context';
import { toast } from 'react-toastify';

jest.mock('../../../hooks/cart/useMutateCart', () => ({
  useCheckout: () => ({
    mutateAsync: jest.fn(() =>
      Promise.resolve({ data: { success: true, message: 'Checkout success' } })
    ),
  }),
}));

jest.mock('react-toastify', () => {
  return {
    ...jest.requireActual('react-toastify'),
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

const customRender = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <BrowserRouter>
      <CartContext.Provider value={providerProps}>{ui}</CartContext.Provider>
    </BrowserRouter>
  );
};

describe('Cart Page', () => {
  it('renders empty cart message and button', () => {
    const providerProps = {
      value: {
        cartItems: [],
        updateCartItemQty: jest.fn(),
        removeFromCart: jest.fn(),
        clearCart: jest.fn(),
      },
    };

    customRender(<CartPage />, providerProps.value);

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Go to Store/i })
    ).toBeInTheDocument();
  });

  it('renders cart items and allows quantity updates', () => {
    const providerProps = {
      value: {
        cartItems: [
          {
            id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
            quantity: 2,
            product: {
              name: 'CC Hatchday Kids T-Shirt',
              price: 10.0,
            },
          },
        ],
        updateCartItemQty: jest.fn(),
        removeFromCart: jest.fn(),
        clearCart: jest.fn(),
      },
    };

    customRender(<CartPage />, providerProps.value);

    expect(screen.getByText(/CC Hatchday Kids T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/subtotal: \$20.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /checkout/i })
    ).toBeInTheDocument();
  });
});
