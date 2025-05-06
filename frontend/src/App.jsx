import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
