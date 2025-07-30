import { useContext, useState, type FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Link,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { yellow } from '@mui/material/colors';
import CartButton from './cart/cart-button';
import { AuthContext } from '../context/auth/auth-context';
import { CartContext } from '../context/cart/cart-context';

interface AppbarProps {
  isStorePage?: boolean;
}

const AppNavbar: FC<AppbarProps> = ({ isStorePage = false }) => {
  const { user, logout } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    clearCart();
    logout();
  };

  return (
    <AppBar
      position='static'
      sx={{ backgroundColor: yellow[100] }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to='/'
        >
          <img
            src='/logo-mandai-equagreen.svg'
            alt='Mandai Logo'
            width={120}
          />
        </Link>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isStorePage && <CartButton />}

            <Tooltip title={user?.name ?? 'Account'}>
              <IconButton
                aria-label='Account'
                onClick={handleAvatarClick}
                color='inherit'
              >
                <Avatar>{user?.name?.[0]?.toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                aria-label='logout'
                onClick={handleLogout}
              >
                <LogoutIcon
                  fontSize='small'
                  sx={{ mr: 1 }}
                />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
