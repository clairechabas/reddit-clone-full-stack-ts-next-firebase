import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { authModalState } from '@/src/atoms/authModalAtom'
import { auth } from '@/src/firebase/clientApp'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { FIREBASE_ERRORS } from '@/src/firebase/errors'

type LogInProps = {}

const LogIn: React.FC<LogInProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [signInWithEmailAndPassword, user, loading, fbError] =
    useSignInWithEmailAndPassword(auth)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    signInWithEmailAndPassword(loginForm.email, loginForm.password)
  }

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

      {fbError && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {FIREBASE_ERRORS[fbError.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}

      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
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
