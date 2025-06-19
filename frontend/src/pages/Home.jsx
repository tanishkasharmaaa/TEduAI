import { Box, Heading, Text, Button, Stack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

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
        <Image
          src="https://cdn.dribbble.com/users/225964/screenshots/17069498/media/3d3fc801ac5199c7e3090b4b5c308424.gif"
          alt="AI Learning"
          mx="auto"
          maxW={{ base: '90%', md: '400px' }}
          borderRadius="xl"
        />
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
