import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ProductInfo } from '../../../types/product';
import ProductList from '../../../components/product/product-list';

const mockProducts: ProductInfo[] = [
  {
    id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
    name: 'CC Hatchday Kids T-Shirt',
    price: 25,
    stock: 10,
    description: 'Test description',
    imageUrl: '/products/product2.png',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'c1917d96-6593-4a99-a1ed-4383194e13a0',
    name: 'Mr Merlion',
    price: 39,
    stock: 10,
    description: 'Test description',
    imageUrl: '/products/product1.png',
    createdAt: '',
    updatedAt: '',
  },
];

describe('Product List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when isLoading is true', () => {
    render(
      <ProductList
        products={[]}
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product cards when not loading', () => {
    render(
      <MemoryRouter>
        <ProductList
          products={mockProducts}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/CC Hatchday Kids T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Mr Merlion/i)).toBeInTheDocument();
  });
});
