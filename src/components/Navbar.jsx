import {
  Box,
  HStack,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import Navlink from './Navlink'

export function Navbar() {
  const { toggleColorMode } = useColorMode()

  const { logout, currentUser } = useAuth()
  
  return (
    <Box
      borderBottom='2px'
      borderBottomColor={useColorModeValue('gray.100', 'gray.700')}
      mb={4}
      py={4}
    >
      <HStack
        justifyContent='flex-end'
        maxW='container.lg'
        mx='auto'
        spacing={4}
      >
        <Navlink to='/' name='Slides project' size='lg' />
        <Spacer />
        {!currentUser && <Navlink to='/login' name='Login' />}
        {!currentUser && <Navlink to='/register' name='Register' />}
        {currentUser && <Navlink to='/profile' name='Profile' />}
        {currentUser && (
          <Navlink
            to='/logout'
            name='Logout'
            onClick={async e => {
              e.preventDefault()
              await logout()
            }}
          />
        )}
        {currentUser && <Navlink to='/my-presentations' name='My presentations' />}
        

    { <Text my={6}>{currentUser?.email}</Text> }
    <IconButton
          variant='ghost'
          icon={useColorModeValue(<FaSun />, <FaMoon />)}
          onClick={toggleColorMode}
          aria-label='toggle-dark-mode'
        />
      </HStack>
    </Box>
  )
}
