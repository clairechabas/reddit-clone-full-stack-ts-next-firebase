import { authModalState } from '@/src/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = () => {}
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
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
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm password"
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
        Sign Up
      </Button>

      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'logIn' }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  )
}
export default SignUp
