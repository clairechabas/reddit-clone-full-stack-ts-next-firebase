import { authModalState } from '@/src/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'

type LogInProps = {}

const LogIn: React.FC<LogInProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = () => {}
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        onChange={handleChange}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        mb={2}
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        onChange={handleChange}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
        mb={2}
      />

      <Button width="100%" height="36px" mt={2} mb={2} type="submit">
        Log In
      </Button>

      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'signUp' }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  )
}
export default LogIn
