import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../../context/auth/auth-context';
import { useProductsById } from '../../hooks/product/useQueryProducts';
import { CartContext } from '../../context/cart/cart-context';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { data: productRes, isLoading } = useProductsById(productId ?? '');

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!productRes?.success || !productRes?.data)
    return <Typography>Product not found.</Typography>;

  const product = productRes.data;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!user) navigate('/login');

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  };

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 4 }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Grid
        container
        spacing={4}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems='flex-start'
      >
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            component='img'
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <Typography
            variant='h4'
            gutterBottom
          >
            {product.name}
          </Typography>

          <Typography
            variant='h6'
            color='primary'
            gutterBottom
          >
            ${product.price}
          </Typography>

          <Typography
            variant='body1'
            sx={{ mb: 2 }}
          >
            {product.description}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='large'
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? 'Out Of Stock' : 'Add to Cart'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
