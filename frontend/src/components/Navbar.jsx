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
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Show,
  Hide,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavButtons = () => (
    <>
      {user?.role === 'teacher' && (
        <>
          <Link to="/teacher/add">
            <Button size="sm" colorScheme="purple">Add Course</Button>
          </Link>
          <Link to="/teacher/dashboard">
            <Button size="sm" colorScheme="purple" variant="ghost">My Courses</Button>
          </Link>
        </>
      )}

      {user?.role === 'admin' && (
        <Link to="/admin">
          <Button size="sm" colorScheme="red">Admin Panel</Button>
        </Link>
      )}

      {user?.role === 'student' && (
        <>
          <Link to="/student/progress">
            <Button size="sm" colorScheme="green" variant="ghost">My Progress</Button>
          </Link>
          <Link to="/ask-ai">
            <Button size="sm" colorScheme="teal" variant="outline">Ask AI</Button>
          </Link>
        </>
      )}

      {!user ? (
        <Link to="/login">
          <Button size="sm" colorScheme="teal">Login</Button>
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
    </>
  );

  return (
    <Box bg={useColorModeValue('blue.500', 'blue.700')} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" color="white">
          TEduAI
        </Text>

        {/* Show only on large screens */}
        <Hide below="md">
          <HStack spacing={4} align="center">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              aria-label="Toggle Theme"
              color="white"
              _hover={{ bg: useColorModeValue('blue.400', 'blue.600') }}
            />
            <NavButtons />
          </HStack>
        </Hide>

        {/* Hamburger for small screens */}
        <Show below="md">
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            aria-label="Menu"
            color="white"
            _hover={{ bg: useColorModeValue('blue.400', 'blue.600') }}
          />
        </Show>
      </Flex>

      {/* Drawer Menu for Small Screens */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <VStack spacing={4} align="stretch">
              <IconButton
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                aria-label="Toggle Theme"
                alignSelf="flex-end"
              />
              <NavButtons />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
