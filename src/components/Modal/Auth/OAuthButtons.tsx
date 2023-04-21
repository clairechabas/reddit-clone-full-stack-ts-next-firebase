import React from 'react'
import { auth } from '@/firebase/clientApp'
import { Flex, Button, Image, Text } from '@chakra-ui/react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, fbError] = useSignInWithGoogle(auth)

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          height="20px"
          mr={4}
          alt="Google logo"
        />{' '}
        Continue with Google
      </Button>
      {fbError && <Text>{fbError.message}</Text>}
    </Flex>
  )
}
export default OAuthButtons
