import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    axios
      .get('https://teduai.onrender.com/api/courses')
      .then(res => setCourses(res.data))
      .catch(() => toast({ title: 'Failed to load courses', status: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Available Courses</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Courses;
