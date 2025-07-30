import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { IconButton, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductFormModal from '../../components/product/modal/product-form';
import DeleteProductModal from '../../components/product/modal/delete-product';
import { useProducts } from '../../hooks/product/useQueryProducts';
import type {
  CreateProductData,
  ProductInfo,
  UpdateProductData,
} from '../../types/product';
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '../../hooks/product/useMutateProducts';

const ProductTable = () => {
  const { data: productRes, isLoading } = useProducts();
  const { mutateAsync: createMutation } = useCreateProduct();
  const { mutateAsync: updateMutation } = useUpdateProduct();
  const { mutateAsync: deleteMutation } = useDeleteProduct();
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<ProductInfo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductInfo | null>(null);

  const productRows = useMemo(() => {
    if (!productRes?.data || !productRes.success) return [];
    return productRes.data;
  }, [productRes]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      headerClassName: 'font-bold',
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 0.5,
      headerClassName: 'font-bold',
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      flex: 0.5,
      headerClassName: 'font-bold',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<ProductInfo>) => (
        <Box>
          <IconButton
            aria-label='edit'
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            color='error'
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleAddProduct = () => {
    // open modal
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (product: ProductInfo) => {
    // open modal
    setEditData(product);
    setOpenForm(true);
  };

  const handleDelete = (product: ProductInfo) => {
    setDeleteTarget(product);
  };

  const processAddProduct = async (product: CreateProductData) => {
    try {
      const createResult = await createMutation(product);

      if (!createResult.data.success) {
        toast.error(createResult.data.message);
        return;
      }

      toast.success(createResult.data.message);
    } catch (err: any) {
      console.error('Failed to create product:', err);
      toast.error(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setOpenForm(false);
      setEditData(null);
    }
  };

  const processUpdateProduct = async (product: UpdateProductData) => {
    try {
      const updateResult = await updateMutation(product);

      if (!updateResult.data.success) {
        toast.error(updateResult.data.message);
        return;
      }

      toast.success(updateResult.data.message);
    } catch (err: any) {
      console.error('Failed to create product:', err);
      toast.error(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setOpenForm(false);
      setEditData(null);
    }
  };

  const processDeleteProduct = async (id: string) => {
    try {
      const deleteResult = await deleteMutation(id);

      if (!deleteResult.data.success) {
        toast.error(deleteResult.data.message);
        return;
      }

      toast.success(deleteResult.data.message);
    } catch (err: any) {
      console.error('Failed to create product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <Box
          display='flex'
          justifyContent='flex-end'
          mb={2}
        >
          <Button
            variant='contained'
            onClick={handleAddProduct}
            startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        </Box>
        <DataGrid
          loading={isLoading}
          rows={productRows}
          columns={columns}
          pageSizeOptions={[5, 10, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
      <ProductFormModal
        open={openForm}
        initialData={editData || undefined}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSubmit={(data) => {
          if (editData) {
            processUpdateProduct({ ...data, id: editData.id });
          } else {
            processAddProduct(data);
          }
        }}
      />
      <DeleteProductModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        productData={deleteTarget}
        onConfirm={processDeleteProduct}
      />
    </>
  );
};

export default ProductTable;
