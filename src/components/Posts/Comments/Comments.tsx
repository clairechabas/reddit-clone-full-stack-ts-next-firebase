import { Post, postState } from '@/src/atoms/postAtom'
import { Box, Flex } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import CommentInput from './CommentInput'
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { firestore } from '@/src/firebase/clientApp'
import { Timestamp } from '@google-cloud/firestore'
import { useSetRecoilState } from 'recoil'

type CommentsProps = {
  user: User
  selectedPost: Post | null
  communityId: string
}

export type Comment = {
  id: string
  creatorId: string
  creatorDisplayName: string
  communityId: string
  postId: string
  postTitle: string
  text: string
  createdAt: Timestamp
}

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const setPostState = useSetRecoilState(postState)

  const onCreateComment = async (commentText: string) => {
    setCreateLoading(true)

    try {
      const batchWrite = writeBatch(firestore)

      // Create comment document
      const commentDocRef = doc(collection(firestore, 'comments'))
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayName: user.email!.split('@')[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      }
      batchWrite.set(commentDocRef, newComment)

      // Update post numberOfComments + 1
      const postDocRef = doc(firestore, 'posts', selectedPost?.id!)
      batchWrite.update(postDocRef, {
        numberOfComments: increment(1),
      })

      await batchWrite.commit()

      // Update store state
      setComments((prev) => [newComment, ...prev])
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }))
      setCommentText('')
    } catch (error) {
      console.log('Error in onCreateComment', error)
    }

    setCreateLoading(false)
  }

  const onDeleteComment = async (comment: any) => {
    // Delete comment document
    // Update post numberOfComments - 1
    // Update store state
  }

  const getPostComments = async () => {}

  /** Fetch post comments on component mount */
  useEffect(() => {
    getPostComments()
  }, [])

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          loading={createLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  )
}
export default Comments
