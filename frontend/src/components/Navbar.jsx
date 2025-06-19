import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Spacer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = ({ user, logout }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue('blue.500', 'blue.700')} px={4} shadow="md">
      <Flex h={16} alignItems="center">
        <Text fontSize="xl" color="white" fontWeight="bold">
          TEduAI
        </Text>

        <Spacer />

        <HStack spacing={4} mr={4} align="center">
          {/* ✅ Theme Toggle Button */}
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            aria-label="Toggle Theme"
            color="white"
            _hover={{ bg: useColorModeValue('blue.400', 'blue.600') }}
          />

          {/* 🧑 Role-Based Navigation */}
          {user?.role === 'teacher' && (
            <>
              <Link to="/teacher/add">
                <Button size="sm" colorScheme="purple">
                  Add Course
                </Button>
              </Link>
              <Link to="/teacher/dashboard">
                <Button size="sm" colorScheme="purple" variant="ghost">
                  My Courses
                </Button>
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button size="sm" colorScheme="red">
                Admin Panel
              </Button>
            </Link>
          )}

          {user?.role === 'student' && (
            <Link to="/student/progress">
              <Button size="sm" colorScheme="green" variant="ghost">
                My Progress
              </Button>
            </Link>
          )}
          {user?.role === 'student' && (
  <Link to="/ask-ai">
    <Button size="sm" colorScheme="teal" variant="outline">
      Ask AI
    </Button>
  </Link>
)}


          {/* 🔐 Auth / Profile */}
          {!user ? (
            <Link to="/login">
              <Button size="sm" colorScheme="teal">
                Login
              </Button>
            </Link>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar size="sm" name={user?.name} />
              </MenuButton>
              <MenuList>
                <MenuItem>{user?.role.toUpperCase()}</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;


