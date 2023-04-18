import { firestore } from '@/src/firebase/clientApp'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'
import { HiLockClosed } from 'react-icons/hi'
import { auth } from '../../../firebase/clientApp'

type CreateCommunityModalProps = {
  open: boolean
  handleClose: () => void
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth)
  const [communityName, setCommunityName] = useState('')
  const [charsRemaining, setCharsRemaining] = useState(21)
  const [communityType, setCommunityType] = useState('public')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return

    setCommunityName(e.target.value)

    setCharsRemaining(21 - e.target.value.length)
  }

  const handleCommunityTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(e.target.name)
  }

  const handleCreateCommunity = async () => {
    if (error) {
      setError('')
    }

    // Validate community name
    // 1. Community name format
    const hasNoSpecialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    if (hasNoSpecialChars.test(communityName) || communityName.length < 3) {
      setError(
        'Community name must be between 3-21 characters, and can only contain letters, numbers, or underscores.'
      )
      return
    }

    setLoading(true)

    try {
      // Because names on Reddit are unique, we can use them as ID
      const communityDocRef = doc(firestore, 'communities', communityName)

      // Using transactions to make sure a community is created
      // only if it has been added to a user's `communitySnippets`
      // or the other way around
      await runTransaction(firestore, async (transaction) => {
        // Check if the community exists in DB
        const communityDoc = await transaction.get(communityDocRef)
        // 2. If community name is not available, throw error
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${communityName} is taken. Try another name.`
          )
        }

        // 3. Otherwise, create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        })

        // create community snippet on our User document
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            // The creator of a community is automatically its moderator
            isModerator: true,
          }
        )
      })
    } catch (error: any) {
      console.log('Error in handleCreateCommunity', error)
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text color="gray.500" fontSize={11}>
                Community names including capitalization cannot be changed.
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text fontSize="9pt" color={!charsRemaining ? 'red' : 'gray.500'}>
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={25}>
                  Community Type
                </Text>

                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === 'public'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post, and comment to this community.
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === 'restricted'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view this community, but only approved users
                        can post.
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === 'private'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Only approved users can view and submit to this
                        community.
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CreateCommunityModal
