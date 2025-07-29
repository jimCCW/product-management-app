import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/product/product-card';
import type { ProductInfo } from '../../../types/product';

const mockProduct = {
  id: '7a299a45-1f0d-47dc-987f-c1a13b19df88',
  name: 'CC Hatchday Kids T-Shirt',
  price: 25,
  stock: 10,
  description: 'Test description',
  imageUrl: '/products/product2.png',
  createdAt: '',
  updatedAt: '',
} as ProductInfo;

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    expect(screen.getByText(/CC Hatchday Kids T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      mockProduct.imageUrl
    );
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      `/store/product/${mockProduct.id}`
    );
  });
});
