import type { NextPage } from 'next'
import PageContent from '../components/Layout/PageContent'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../firebase/clientApp'
import { useEffect, useState } from 'react'
import { collection, orderBy, query, limit, getDocs } from 'firebase/firestore'
import usePosts from '../hooks/usePosts'
import { Post } from '../atoms/postAtom'
import PostItem from '../components/Posts/PostItem'
import PostLoader from '../components/Posts/PostLoader'
import { Stack } from '@chakra-ui/react'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts()

  const buildUserHomeFeed = () => {}

  const buildNoUserHomeFeed = async () => {
    setLoading(true)

    try {
      // Fetching most popular posts based on their vote status
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      )
      const postsDocs = await getDocs(postQuery)
      const posts = postsDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }))
    } catch (error) {
      console.log('Error in buildNoUserHomeFeed', error)
    }

    setLoading(false)
  }

  const getUserPostVotes = () => {}

  /** Do X */
  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser])

  return (
    <PageContent>
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                post={post}
                key={post.id}
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (vote) => vote.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                isHomePage
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* Recommendations */}</>
    </PageContent>
  )
}

export default Home
