import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../../context/cart/cart-context';

const CartButton = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  );
  return (
    <IconButton
      color='inherit'
      onClick={() => navigate('/store/cart')}
    >
      <Badge
        badgeContent={cartCount}
        color='error'
      >
        <ShoppingCartIcon sx={{ color: 'black' }} />
      </Badge>
    </IconButton>
  );
};

export default CartButton;
