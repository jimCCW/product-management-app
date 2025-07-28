import { useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import {
  productSchema,
  type ProductFormData,
} from '../../../schema/product-schema';

interface ProductFormModalProps {
  open: boolean;
  initialData?: Partial<ProductFormData>;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

const DEFAULT_FORM_VALUE = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
};

const ProductFormModal: FC<ProductFormModalProps> = ({
  open,
  initialData,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema as any),
    defaultValues: {
      ...DEFAULT_FORM_VALUE,
    },
  });

  useEffect(() => {
    reset(initialData ?? { ...DEFAULT_FORM_VALUE });
  }, [initialData, reset]);

  const onHandleClose = () => {
    reset({ ...DEFAULT_FORM_VALUE });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onHandleClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>{initialData?.name ? 'Edit' : 'Add'} Product</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            label='Product Name'
            fullWidth
            margin='normal'
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label='Price'
            fullWidth
            margin='normal'
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price')}
          />
          <TextField
            label='Stock'
            fullWidth
            margin='normal'
            error={!!errors.stock}
            helperText={errors.stock?.message}
            {...register('stock')}
          />
          <TextField
            label='Description'
            fullWidth
            margin='normal'
            multiline
            rows={3}
            {...register('description')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onHandleClose}>Cancel</Button>
          <Button
            type='submit'
            variant='contained'
          >
            {initialData?.name ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductFormModal;
