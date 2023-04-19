import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import PageContent from '../../../components/Layout/PageContent'
import NewPostForm from '@/src/components/Posts/NewPostForm'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/src/firebase/clientApp'
import { useRecoilValue } from 'recoil'
import { communityState } from '@/src/atoms/communitiesAtom'

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth)
  const communityStateValue = useRecoilValue(communityState)

  return (
    <PageContent>
      {/* New Post Form */}
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>

      {/* About */}
      <></>
    </PageContent>
  )
}
export default SubmitPostPage
