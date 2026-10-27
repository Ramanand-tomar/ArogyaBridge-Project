import React, { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import toast from 'react-hot-toast';

/**
 * Route protection wrapper to prevent unauthenticated access to dashboards
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { account } = useContext(Web3Context);
  const { hhNumber } = useParams();

  const token = localStorage.getItem('arogya_auth_token');
  const userJson = localStorage.getItem('arogya_user');

  if (!token) {
    toast.error('Authentication required. Please sign in with your Web3 wallet.', { id: 'auth-required' });
    return <Navigate to="/login" replace />;
  }

  if (userJson && requiredRole) {
    try {
      const user = JSON.parse(userJson);
      if (user.role && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
        toast.error(`Access restricted. Requires ${requiredRole} credentials.`, { id: 'role-restricted' });
        return <Navigate to="/home" replace />;
      }

      // If hhNumber is in route params, verify ownership
      if (hhNumber && user.hhNumber && user.hhNumber !== hhNumber) {
        toast.error('Identity mismatch. You can only access your own profile dashboard.', { id: 'id-mismatch' });
        return <Navigate to={`/${user.role.toLowerCase()}/${user.hhNumber}`} replace />;
      }
    } catch {
      // In case user json was corrupt
    }
  }

  return children;
};

export default ProtectedRoute;
