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

  if (!token) {
    toast({
      title: 'Token missing from URL',
      status: 'error',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
    return;
  }

  // Optional: Log to debug
  console.log('Received token from URL:', token);

  axios.get('https://teduai.onrender.com/api/auth/user', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    const user = res?.data;
    if (!user) {
      throw new Error('No user returned from backend');
    }

    login(user, token); // ✅ Save token & user
    toast({
      title: 'Login Successful',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });

    // Navigate after slight delay to ensure context update
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
  })
  .catch(err => {
    console.error('Login failed:', err?.response || err?.message || err);
    toast({
      title: 'Login Failed',
      description: 'Unable to fetch user. Try again.',
      status: 'error',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
  });
}, [location.search, login, navigate, toast]);


  const handleGoogleLogin = () => {
    window.location.href = 'https://teduai.onrender.com/api/auth/google';
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack spacing={6} textAlign="center">
        <Heading>Welcome to TEduAI</Heading>
        <Text>Login to access your dashboard</Text>
        <Button colorScheme="red" size="lg" onClick={handleGoogleLogin}>
          Continue with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
