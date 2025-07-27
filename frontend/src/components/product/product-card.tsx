import { type FC } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { ProductInfo } from '../../types/product';

interface ProductCardProps {
  product: ProductInfo;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component='img'
        height='160'
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant='h6'>{product.name}</Typography>
        <Typography color='text.secondary'>${product.price}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          component={Link}
          to={`/store/product/${product.id}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
