import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../../context/cart/cart-context';
import { useCheckout } from '../../hooks/cart/useMutateCart';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQty, removeFromCart, clearCart } =
    useContext(CartContext);
  const { mutateAsync: checkoutMutation } = useCheckout();

  const totalPrice = useMemo(() => {
    return cartItems?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const checkoutResult = await checkoutMutation();

      if (!checkoutResult.data.success) {
        toast.error(checkoutResult.data.message);
        return;
      }

      toast.success(checkoutResult.data.message);
      clearCart();
      navigate('/store');
    } catch (err: any) {
      console.error('Failed to checkout:', err);
      toast.error(err.response?.data?.message || 'Failed to checkout.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <Box p={4}>
        <Typography
          variant='h5'
          gutterBottom
        >
          Your cart is empty
        </Typography>
        <Button
          variant='contained'
          onClick={() => navigate('/store')}
        >
          Go to Store
        </Button>
      </Box>
    );
  }

  return (
    <Box
      p={{ xs: 2, md: 4 }}
      maxWidth='800px'
      mx='auto'
    >
      <Typography
        variant='h4'
        gutterBottom
      >
        Your Cart
      </Typography>
      <Box
        textAlign='right'
        mb={2}
      >
        <Button
          variant='outlined'
          onClick={() => navigate('/store')}
        >
          Continue Shopping
        </Button>
      </Box>

      <Stack spacing={2}>
        {cartItems.map((item) => (
          <Paper
            key={item.id}
            sx={{ p: 2 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems='center'
              justifyContent='space-between'
            >
              <Box flex={1}>
                <Typography variant='h6'>{item.product.name}</Typography>
                <Typography variant='body2'>
                  Price: ${item.product.price.toFixed(2)}
                </Typography>
                <Typography variant='body2'>
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>

              <Stack
                direction='row'
                alignItems='center'
                spacing={1}
              >
                <IconButton
                  onClick={() =>
                    updateCartItemQty({
                      id: item.id,
                      quantity: item.quantity - 1,
                    })
                  }
                  disabled={item.quantity < 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  onClick={() =>
                    updateCartItemQty({
                      id: item.id,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              <IconButton
                onClick={() => removeFromCart(item.id)}
                color='error'
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box textAlign='right'>
        <Typography variant='h6'>Total: ${totalPrice.toFixed(2)}</Typography>
        <Button
          variant='contained'
          size='large'
          color='primary'
          onClick={handleCheckout}
          sx={{ mt: 2 }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
