import { Post, postState } from '@/src/atoms/postAtom'
import { firestore } from '@/src/firebase/clientApp'
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import { User } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import CommentInput from './CommentInput'
import type { Comment } from './CommentItem'
import CommentItem from './CommentItem'

type CommentsProps = {
  user: User
  selectedPost: Post | null
  communityId: string
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
  const [loadingDeleteId, setLoadingDeleteId] = useState('')

  /**
   * Create a post's comment
   */
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

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp

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

  /**
   * Delete a post's comment
   */
  const onDeleteComment = async (comment: any) => {
    setLoadingDeleteId(comment.id)

    try {
      const batchWrite = writeBatch(firestore)

      // Delete comment document
      const commentDocRef = doc(firestore, 'comments', comment.id)
      batchWrite.delete(commentDocRef)

      // Update post numberOfComments - 1
      const postDocRef = doc(firestore, 'posts', selectedPost?.id!)
      batchWrite.update(postDocRef, {
        numberOfComments: increment(-1),
      })

      await batchWrite.commit()

      // Update store state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }))
      setComments((prev) => prev.filter((item) => item.id !== comment.id))
    } catch (error) {
      console.log('Error in onDeleteComment', error)
    }

    setLoadingDeleteId('')
  }

  /**
   * Get comments for a post
   */
  const getPostComments = async () => {
    setFetchLoading(true)

    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost?.id),
        orderBy('createdAt', 'desc')
      )
      const commentsDocs = await getDocs(commentsQuery)
      const comments = commentsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setComments(comments as Comment[])
    } catch (error) {
      console.log('Error in getPostComments', error)
    }

    setFetchLoading(false)
  }

  /** Fetch post comments on component mount */
  useEffect(() => {
    if (!selectedPost) return

    getPostComments()
  }, [selectedPost])

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
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            loading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>

      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing={4} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}
export default Comments
