import {
  Box, Button, Flex, Input, Spinner, Text, VStack, useToast
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// 🔧 Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://teduai.onrender.com';

const AIDoubtChat = () => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim() || !token) return;

    const newMessage = { sender: 'user', text: input };
    setChat((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/doubt/solve`,
        { question: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
    } catch (err) {
      console.error("AI Error:", err?.response?.data || err.message);
      toast({
        title: 'AI error',
        description: err?.response?.data?.error || 'Something went wrong. Try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/doubt/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChat(res.data || []);
    } catch (err) {
      console.error("History Error:", err?.response?.data || err.message);
      toast({
        title: 'Failed to load history',
        description: err?.response?.data?.error || 'Try refreshing the page.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      fetchHistory();
    }
  }, [user?.role]);

  const handleClear = () => {
    setChat([]);
    toast({
      title: 'Chat cleared (local)',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    scrollToBottom();
  };

  // 🔐 Role-based access check
  if (!user || user.role !== 'student') {
    return (
      <Box p={6}>
        <Text fontSize="lg" fontWeight="semibold" color="red.500">
          Only students can access this page.
        </Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" maxW="700px" mx="auto" h="80vh" p={4} borderWidth={1} borderRadius="lg">
      <Box flex="1" overflowY="auto" mb={4} p={2}>
        <VStack align="stretch" spacing={3}>
          {chat.map((msg, i) => (
            <Box
              key={i}
              alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
              bg={msg.sender === 'user' ? 'blue.500' : 'gray.200'}
              color={msg.sender === 'user' ? 'white' : 'black'}
              px={4} py={2} borderRadius="lg" maxW="80%"
            >
              <Text whiteSpace="pre-wrap">{msg.text}</Text>
            </Box>
          ))}
          {loading && (
            <Box bg="gray.100" px={4} py={2} borderRadius="lg" alignSelf="flex-start">
              <Spinner size="sm" mr={2} /> <Text display="inline">AI is thinking...</Text>
            </Box>
          )}
          <div ref={chatEndRef} />
        </VStack>
      </Box>

      <Flex gap={2}>
        <Input
          placeholder="Ask your doubt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} colorScheme="teal" isDisabled={loading || !input}>
          Send
        </Button>
        <Button
          onClick={handleClear}
          colorScheme="red"
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
      </Flex>
    </Flex>
  );
};

export default AIDoubtChat;
