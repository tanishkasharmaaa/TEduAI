import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@chakra-ui/react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const toast = useToast();

  if (!user) {
    toast({ title: 'Please login first', status: 'warning', isClosable: true });
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast({ title: 'Access Denied', status: 'error', isClosable: true });
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
