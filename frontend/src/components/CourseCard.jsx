import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  VStack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      p={4}
      shadow="lg"
      bg={useColorModeValue('white', 'gray.800')}
      _hover={{ transform: 'scale(1.02)', transition: '0.3s' }}
    >
      <VStack spacing={3} align="start">
        <Image
          src="https://source.unsplash.com/400x200/?education,code"
          alt="Course"
          borderRadius="md"
          w="100%"
          h="150px"
          objectFit="cover"
        />
        <Badge colorScheme="blue">{course.category}</Badge>
        <Heading fontSize="xl">{course.title}</Heading>
        <Text color="gray.600" noOfLines={2}>{course.description}</Text>
        <Text fontWeight="bold">₹{course.price}</Text>
        <Link to={`/courses/${course._id}`}>
          <Button colorScheme="blue" size="sm" mt={2}>
            View Details
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default CourseCard;
