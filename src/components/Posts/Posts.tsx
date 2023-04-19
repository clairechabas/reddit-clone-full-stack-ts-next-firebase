import { Community } from '@/src/atoms/communitiesAtom'
import { Post } from '@/src/atoms/postAtom'
import { auth, firestore } from '@/src/firebase/clientApp'
import usePosts from '@/src/hooks/usePosts'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Stack } from '@chakra-ui/react'
import PostLoader from './PostLoader'

type PostsProps = {
  communityData: Community
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts()

  /**
   * Get posts for a community
   */
  const getPosts = async () => {
    setLoading(true)

    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      )
      const postDocs = await getDocs(postsQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }))
    } catch (error) {
      console.log('Error in getPosts', error)
    }

    setLoading(false)
  }

  // Fetch posts when component mounts
  useEffect(() => {
    getPosts()
  }, [])

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={undefined}
              onVote={onVote}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
export default Posts
