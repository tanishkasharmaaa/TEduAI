import { Box, Heading, Text, Button, Stack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import TEduAI from '../assets/TEduAI.png'

const Home = () => {
  return (
    <Box textAlign="center" p={10}>
      <Stack spacing={6}>
        <Heading fontSize={{ base: '2xl', md: '4xl' }}>
          Unlock AI-Powered Learning
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
          Buy or teach courses and get real-time help via AI doubt-solving.
        </Text>
        <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="80vh"
      px={4}
    >
      <Image
        src={TEduAI}
        alt="TEduAI Logo"
        maxW={{ base: '80%', sm: '60%', md: '400px', lg: '480px' }}
        objectFit="contain"
        borderRadius="xl"
        boxShadow="xl"
        transition="all 0.3s ease"
        _hover={{ transform: 'scale(1.03)' }}
      />
    </Box>
        <Stack direction="row" justify="center">
          <Link to="/courses">
            <Button colorScheme="blue" size="lg">Browse Courses</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Login</Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
