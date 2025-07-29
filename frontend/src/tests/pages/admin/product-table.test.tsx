import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useProducts } from '../../../hooks/product/useQueryProducts';
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '../../../hooks/product/useMutateProducts';
import type { ProductInfo } from '../../../types/product';
import ProductTable from '../../../pages/admin/product-table';

jest.mock('../../../hooks/product/useQueryProducts', () => ({
  useProducts: jest.fn(),
}));

jest.mock('../../../hooks/product/useMutateProducts', () => ({
  useCreateProduct: jest.fn(),
  useDeleteProduct: jest.fn(),
  useUpdateProduct: jest.fn(),
}));

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

describe('Product Table', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table and Add Product button', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { success: true, data: [mockProduct] },
      isLoading: false,
    });

    (useCreateProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    (useUpdateProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    (useDeleteProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });

    render(<ProductTable />);
    expect(
      await screen.findByText(/CC Hatchday Kids T-Shirt/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add product/i })
    ).toBeInTheDocument();
  });

  it('opens form modal when Add Product clicked', () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { success: true, data: [] },
      isLoading: false,
    });

    (useCreateProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    (useUpdateProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    (useDeleteProduct as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });

    render(<ProductTable />);
    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    });
  });
});
