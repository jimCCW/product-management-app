import type { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import ProductCard from './product-card';
import type { ProductInfo } from '../../types/product';

interface ProductListProps {
  products: ProductInfo[];
  isLoading: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, isLoading }) => {
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Grid
      container
      spacing={3}
    >
      {products?.map((product) => (
        <Grid
          key={product.id}
          size={{ xs: 12, sm: 6, md: 3, xl: 2 }}
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
