import { Box, Container, Typography } from '@mui/material';
import ProductList from '../../components/product/product-list';
import { useProducts } from '../../hooks/product/useQueryProducts';

const StorePage = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <Container
      maxWidth={false}
      sx={{ mt: 4 }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography
          variant='h5'
          className='!font-bold'
        >
          Products
        </Typography>
      </Box>

      <ProductList
        products={products?.data ?? []}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default StorePage;
