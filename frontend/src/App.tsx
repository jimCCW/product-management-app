import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './context/auth/auth-provider';
import AppRouter from './routes/router';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import CartProvider from './context/cart/cart-provider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
          <ToastContainer
            position='top-right'
            autoClose={3000}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
