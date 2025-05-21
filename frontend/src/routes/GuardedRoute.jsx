import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function GuardedRoute({ requireAuth, redirectTo }) {
  const { user } = useContext(AuthContext);
  const isAuthenticated = Boolean(user);
  const canAccess = requireAuth ? isAuthenticated : !isAuthenticated;

  return canAccess ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
