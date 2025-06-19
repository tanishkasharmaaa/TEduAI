import {
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td,
  Badge, useToast, Spinner, Flex
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://teduai.onrender.com/api/teacher/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch {
      toast({ title: 'Failed to load courses', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'teacher') fetchCourses();
  }, []);

  if (user?.role !== 'teacher') {
    return <Text p={6}>Only teachers can access this page.</Text>;
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>My Courses</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Students Enrolled</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.map(course => (
            <Tr key={course._id}>
              <Td>{course.title}</Td>
              <Td><Badge colorScheme="purple">{course.category}</Badge></Td>
              <Td><Badge colorScheme="green">{course.enrolledCount}</Badge></Td>
              <Td><Badge colorScheme="blue">Published</Badge></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TeacherDashboard;
