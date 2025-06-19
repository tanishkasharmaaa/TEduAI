import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, useToast, Text, Badge, IconButton, Flex, Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DeleteIcon } from '@chakra-ui/icons';

const AdminPanel = () => {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('https://teduai.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsRes = await axios.get('https://teduai.onrender.com/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch {
      toast({ title: 'Failed to load admin data', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const promoteToTeacher = async (userId) => {
    try {
      await axios.post(`https://teduai.onrender.com/api/admin/promote/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'User promoted to Teacher', status: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to promote user', status: 'error' });
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://teduai.onrender.com/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'User deleted', status: 'success' });
      fetchData();
    } catch {
      toast({ title: 'Failed to delete user', status: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Admin Dashboard</Heading>

      {stats && (
        <Flex gap={8} mb={6}>
          <Badge colorScheme="blue">Students: {stats.studentCount}</Badge>
          <Badge colorScheme="green">Teachers: {stats.teacherCount}</Badge>
          <Badge colorScheme="purple">Courses: {stats.totalCourses}</Badge>
          <Badge colorScheme="yellow">Est. Revenue: {stats.estimatedRevenue}</Badge>
        </Flex>
      )}

      <Heading fontSize="lg" mb={2}>All Users</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge colorScheme={user.role === 'admin' ? 'red' : user.role === 'teacher' ? 'green' : 'blue'}>
                  {user.role.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                {user.role === 'student' && (
                  <Button size="sm" colorScheme="green" onClick={() => promoteToTeacher(user._id)}>Promote</Button>
                )}
                {user.role !== 'admin' && (
                  <IconButton
                    ml={2}
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteUser(user._id)}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminPanel;
