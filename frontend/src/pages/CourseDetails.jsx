import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  useToast,
  Badge,
  Stack
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [completedLectures, setCompletedLectures] = useState([]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`https://teduai.onrender.com/api/courses/${id}`);
      setCourse(res.data);
    } catch {
      toast({ title: 'Error loading course', status: 'error' });
    }
  };

  const checkEnrollment = async () => {
    const res = await axios.get('https://teduai.onrender.com/api/student/my-courses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const match = res.data.find(c => c.course._id === id);
    if (match) {
      setEnrolled(true);
      setCompletedLectures(match.completedLectures);
    }
  };

  const enroll = async () => {
    try {
      const { data } = await axios.post(`https://teduai.onrender.com/api/payment/create-order/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post('https://teduai.onrender.com/api/payment/verify-payment', {
        courseId: id,
        orderId: data.orderId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({ title: 'Enrolled successfully!', status: 'success' });
      setEnrolled(true);
    } catch {
      toast({ title: 'Enrollment failed', status: 'error' });
    }
  };

  const markComplete = async (lectureId) => {
    try {
      await axios.post(`https://teduai.onrender.com/api/student/mark-complete/${id}/${lectureId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedLectures(prev => [...prev, lectureId]);
    } catch {
      toast({ title: 'Failed to mark lecture complete', status: 'error' });
    }
  };

  useEffect(() => {
    fetchCourse();
    if (user?.role === 'student') {
      checkEnrollment();
    }
  }, [id]);

  if (!course) return <Text>Loading...</Text>;

  return (
    <Box p={6}>
      <Heading mb={2}>{course.title}</Heading>
      <Text color="gray.600">{course.description}</Text>
      <Badge colorScheme="blue" my={2}>{course.category}</Badge>
      <Text fontWeight="bold">₹{course.price}</Text>

      {user?.role === 'student' && !enrolled && (
        <Button mt={4} colorScheme="blue" onClick={enroll}>Enroll Now</Button>
      )}

      {user?.role === 'student' && enrolled && (
        <Box mt={6}>
          <Heading fontSize="xl" mb={2}>Lectures</Heading>
          <Divider mb={4} />
          <VStack align="stretch" spacing={4}>
            {course.lectures.map(lec => (
              <Box key={lec._id} borderWidth="1px" borderRadius="lg" p={4}>
                <Stack direction="row" justify="space-between" align="center">
                  <Text fontWeight="semibold">{lec.title}</Text>
                  {completedLectures.includes(lec._id) ? (
                    <Badge colorScheme="green">Completed</Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => markComplete(lec._id)}
                      colorScheme="teal"
                    >
                      Mark Complete
                    </Button>
                  )}
                </Stack>
                <Box mt={3}>
                  <video width="100%" controls src={lec.videoUrl}></video>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default CourseDetails;
