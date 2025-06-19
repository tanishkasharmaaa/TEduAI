import { Box, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box p={6}>
      <Heading>Dashboard</Heading>
      <Text mt={4}>Hello, {user?.name}</Text>
      <Text>Your role: {user?.role}</Text>
    </Box>
  );
};

export default Dashboard;
