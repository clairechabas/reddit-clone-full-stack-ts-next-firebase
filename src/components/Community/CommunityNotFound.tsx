import React from 'react'
import Link from 'next/link'
import { Flex, Button } from '@chakra-ui/react'

const CommunityNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, that community does not exist or has been banned.
      <Link href="/">
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  )
}
export default CommunityNotFound
