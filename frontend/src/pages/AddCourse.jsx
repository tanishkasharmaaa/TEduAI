import {
  Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Heading, useToast, HStack, IconButton
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const AddCourse = () => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    lectures: []
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const addLecture = () => {
    setCourseData(prev => ({
      ...prev,
      lectures: [...prev.lectures, { title: '', videoUrl: '' }]
    }));
  };

  const updateLecture = (index, field, value) => {
    const updated = [...courseData.lectures];
    updated[index][field] = value;
    setCourseData(prev => ({ ...prev, lectures: updated }));
  };

  const removeLecture = index => {
    const updated = courseData.lectures.filter((_, i) => i !== index);
    setCourseData(prev => ({ ...prev, lectures: updated }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://teduai.onrender.com/api/teacher/courses', courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Course created successfully', status: 'success' });
      setCourseData({ title: '', description: '', category: '', price: '', lectures: [] });
    } catch (err) {
      toast({ title: 'Error creating course', status: 'error' });
    }
  };

  if (user?.role !== 'teacher') {
    return <Heading size="md" p={6}>Only teachers can add courses.</Heading>;
  }

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading mb={4}>Add New Course</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input name="title" value={courseData.title} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea name="description" value={courseData.description} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Input name="category" value={courseData.category} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Price (₹)</FormLabel>
          <Input type="number" name="price" value={courseData.price} onChange={handleChange} />
        </FormControl>

        <Heading fontSize="lg" mt={6}>Lectures</Heading>
        {courseData.lectures.map((lec, index) => (
          <Box key={index} borderWidth="1px" p={4} borderRadius="md">
            <HStack>
              <FormControl isRequired>
                <FormLabel>Lecture Title</FormLabel>
                <Input
                  value={lec.title}
                  onChange={e => updateLecture(index, 'title', e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Video URL</FormLabel>
                <Input
                  value={lec.videoUrl}
                  onChange={e => updateLecture(index, 'videoUrl', e.target.value)}
                />
              </FormControl>
              <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => removeLecture(index)} />
            </HStack>
          </Box>
        ))}

        <Button onClick={addLecture} leftIcon={<AddIcon />} colorScheme="teal" variant="outline">
          Add Lecture
        </Button>

        <Button colorScheme="blue" onClick={handleSubmit}>Submit Course</Button>
      </VStack>
    </Box>
  );
};

export default AddCourse;
