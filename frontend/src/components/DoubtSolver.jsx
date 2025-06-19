import {
  Box, Button, FormControl, FormLabel, Input, Textarea,
  VStack, Text, useToast, Spinner, Heading
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoubtSolver = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { token, user } = useAuth();

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({ title: 'Please enter a question.', status: 'warning', position: 'top' });
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const res = await axios.post(
        '/api/doubt/solve',
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      toast({ title: 'Error solving doubt.', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'student') {
    return (
      <Box p={6}>
        <Heading size="md">Only students can access the AI doubt solver.</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">🧠 Ask Your Doubt</Heading>

        <FormControl>
          <FormLabel>Your Question</FormLabel>
          <Textarea
            placeholder="e.g. What is a closure in JavaScript?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Get Answer'}
        </Button>

        {answer && (
          <Box p={4} bg="gray.100" borderRadius="md" mt={4}>
            <Text fontWeight="bold" mb={2}>AI Answer:</Text>
            <Text whiteSpace="pre-wrap">{answer}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DoubtSolver;
