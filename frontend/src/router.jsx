import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GuardedRoute from './routes/GuardedRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <GuardedRoute requireAuth={false} redirectTo="/" />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <GuardedRoute requireAuth={true} redirectTo="/login" />,
    children: [{ path: '/profile', element: <Profile /> }],
  },
]);

export default router;
