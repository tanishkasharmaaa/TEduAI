import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const Login = () => {
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth callback
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      axios.get('https://teduai.onrender.com/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        login(res.data, token);
        toast({ title: 'Login Successful', status: 'success' });
        navigate('/dashboard');
      })
      .catch(() => {
        toast({ title: 'Login Failed', status: 'error' });
      });
    }
  }, [location.search]);

  const handleGoogleLogin = () => {
    window.location.href = 'https://teduai.onrender.com/api/auth/google';
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack spacing={6} textAlign="center">
        <Heading>Welcome to AI Learn</Heading>
        <Text>Login to access your dashboard</Text>
        <Button colorScheme="red" size="lg" onClick={handleGoogleLogin}>
          Continue with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
