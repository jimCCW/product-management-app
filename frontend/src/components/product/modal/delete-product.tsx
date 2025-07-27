import { type FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { ProductInfo } from '../../../types/product';

interface DeleteProductModalProps {
  open: boolean;
  productData: ProductInfo | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}
const DeleteProductModal: FC<DeleteProductModalProps> = ({
  open,
  productData,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{productData?.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color='error'
          variant='contained'
          onClick={() => onConfirm(productData?.id || '')}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductModal;
