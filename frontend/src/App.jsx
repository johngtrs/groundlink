import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

export default function App() {
  const { initialLoading } = useContext(AuthContext);

  if (initialLoading) {
    return null;
  }

  return <RouterProvider router={router} />;
}
