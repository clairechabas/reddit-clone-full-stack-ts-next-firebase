import React, { useState } from 'react'
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react'
import { BsDot, BsReddit } from 'react-icons/bs'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
import { auth } from '@/src/firebase/clientApp'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '@/src/atoms/authModalAtom'

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [sendPasswordResetEmail, sending, fbError] =
    useSendPasswordResetEmail(auth)
  const setAuthModalState = useSetRecoilState(authModalState)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await sendPasswordResetEmail(email)
    setSuccess(true)
  }

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700}>Reset your password</Text>
      {success ? (
        <Text>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            {`Enter the email associated with your account and we'll send you a
            reset link.`}
          </Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Input
              required
              type="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              mb={2}
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
            />
            {fbError && (
              <Text textAlign="center" fontSize="10pt" color="red">
                {fbError.message}
              </Text>
            )}
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}

      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'logIn' }))
          }
        >
          LOG IN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'signUp' }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  )
}
export default ResetPassword
