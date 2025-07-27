import AppNavbar from '../../components/app-bar';
import { Box, Container, Typography } from '@mui/material';
import ProductTable from './product-table';

const AdminDashboardPage = () => {
  return (
    <div>
      <AppNavbar />
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
            Product Dashboard
          </Typography>
        </Box>

        <ProductTable />
      </Container>
    </div>
  );
};

export default AdminDashboardPage;
