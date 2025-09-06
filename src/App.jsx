import { Offline } from 'react-detect-offline';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MdOutlineWifiOff } from 'react-icons/md';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './assets/Pages/MainLayout/MainLayout';
import Home from './assets/Pages/Home/Home';
import Register from './assets/Pages/Register/Register';
import Login from './assets/Pages/Login/Login';
import NotFound from './assets/Pages/NotFound/NotFound';
import ResetPassword from './assets/Pages/ResetPassword/ResetPassword';
import ProtectedRoutes from './assets/Components/ProtectRoutes/ProtectRoutes';
import { TokenProvider } from './assets/Context/TokenContext/TokenContext';
import Cafes from './assets/Pages/Cafes/Cafes';
import About from './assets/Pages/About/About';
import Products from './assets/Pages/Products/Products';
import MainAdminDashboard from './assets/Pages/MainAdminDashboard/MainAdminDashboard';
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from '../src/assets/Context/CartContext';
import Cart from './assets/Pages/Cart/Cart';
import Settings from './assets/Pages/Settings/Settings';
import PersonalInfo from './assets/Components/PersonalInfo/PersonalInfo';
import Privacy from './assets/Components/Privacy/Privacy';
import Orders from './assets/Components/Orders/Orders';
import CheckoutStepper from "./assets/Components/OrderStepper/OrderStepper";
const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children: [
      { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: "home", element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "resetpassword", element: <ResetPassword /> },
      { path: "admindashboard", element: <ProtectedRoutes> <MainAdminDashboard /> </ProtectedRoutes> },
      { path: "cafes", element:  <Cafes />  },
      { path: "products", element:  <Products />  },
      { path: "cart", element:  <Cart />  },
      { path: "about", element:  <About />  },
     { path:"/checkout" ,element: <CheckoutStepper />},
      {
          path: 'settings', element:
            <ProtectedRoutes>
              <Settings />
            </ProtectedRoutes>
          , children: [{
            index: true, element: <PersonalInfo />
          },
          {
            path: 'privacy', element: <Privacy />
          },
          {
            path: 'orders', element:
              <Orders />
          }
          ]
        },

      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      {/* <Offline>
        <div className='offline flex items-center p-3 text-center'>
          Oops... You are offline. Check your connection <MdOutlineWifiOff className='ms-2' />
        </div>
      </Offline> */}
      <TokenProvider>
        <CartProvider >
        <Toaster position="bottom-left" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', }, }} />
        <RouterProvider router={routes} />
        </CartProvider>
      </TokenProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}