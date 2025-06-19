import {
  Box, Heading, SimpleGrid, Progress, Text, VStack,
  Button, Badge, useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 🔥 animation added

const MotionBox = motion(Box); // ✅ wrap Box for animation

const StudentProgress = () => {
  const { token, user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProgress = async () => {
    try {
      const res = await axios.get('https://teduai.onrender.com/api/student/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(res.data);
    } catch {
      toast({ title: 'Failed to load progress', status: 'error' });
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      fetchProgress();
    }
  }, []);

  if (user?.role !== 'student') {
    return <Text p={6}>Only students can access this page.</Text>;
  }

  return (
    <Box p={6}>
      <Heading mb={6}>My Learning Progress</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {enrollments.map(({ course, completedLectures }) => {
          const total = course.lectures.length;
          const done = completedLectures.length;
          const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <MotionBox
              key={course._id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="start" spacing={3}>
                <Heading size="md">{course.title}</Heading>
                <Badge colorScheme="purple">{course.category}</Badge>
                <Text>{done}/{total} lectures completed</Text>
                <Progress value={progressPercent} w="100%" colorScheme="green" borderRadius="md" />
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  Resume Course
                </Button>
              </VStack>
            </MotionBox>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default StudentProgress;
