import { Outlet } from 'react-router-dom';
import AppNavbar from '../../components/app-bar';

const StoreLayout = () => {
  return (
    <>
      <AppNavbar isStorePage={true} />
      <Outlet />
    </>
  );
};

export default StoreLayout;
