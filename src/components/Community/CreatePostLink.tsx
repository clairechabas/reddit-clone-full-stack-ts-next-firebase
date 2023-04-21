import React from 'react'
import { useRouter } from 'next/router'
import { Flex, Icon, Input } from '@chakra-ui/react'
import { FaReddit } from 'react-icons/fa'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '@/atoms/authModalAtom'
import { auth } from '@/firebase/clientApp'
import { IoImageOutline } from 'react-icons/io5'
import { BsLink45Deg } from 'react-icons/bs'
import useDirectory from '@/hooks/useDirectory'

const CreatePostLink: React.FC = () => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const setAuthModalState = useSetRecoilState(authModalState)
  const { toggleMenuOpen } = useDirectory()

  /**
   * Clicking on the input redirects user to `submit` page
   */
  const handleInputClick = () => {
    // If user is not signed in, show login modal
    if (!user) {
      setAuthModalState({ open: true, view: 'logIn' })
      return
    }

    const { communityId } = router.query

    if (communityId) {
      router.push(`/r/${communityId}/submit`)
      return
    }

    // If we don't have a `communityId` we're on the home page
    // in which case we want to open the directory menu for the
    // user to choose a community (we only want users to post
    // inside communities).
    toggleMenuOpen()
  }

  return (
    <Flex
      justify="space-evenly"
      align="center"
      p={2}
      mb={4}
      height="56px"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        bg="gray.50"
        borderColor="gray.200"
        borderRadius={4}
        height="36px"
        mr={4}
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
        onClick={handleInputClick}
      />

      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  )
}
export default CreatePostLink
