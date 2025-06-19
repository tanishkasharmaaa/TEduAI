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
  Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <Box bg={useColorModeValue('blue.500', 'blue.700')} px={4} shadow="md">
      <Flex h={16} alignItems={'center'}>
        <Text fontSize="xl" color="white" fontWeight="bold">
          TEduAI
        </Text>
        <Spacer />
        {!user ? (
          <Link to="/login">
            <Button colorScheme="teal">Login</Button>
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
      </Flex>
    </Box>
  );
};

export default Navbar;
