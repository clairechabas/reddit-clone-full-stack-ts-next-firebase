import { Stack } from '@chakra-ui/react'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Post } from '../atoms/postAtom'
import PageContent from '../components/Layout/PageContent'
import PostItem from '../components/Posts/PostItem'
import PostLoader from '../components/Posts/PostLoader'
import { auth, firestore } from '../firebase/clientApp'
import useCommunityData from '../hooks/useCommunityData'
import usePosts from '../hooks/usePosts'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { communityStateValue } = useCommunityData()
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts()

  /** Feed for authenticated users */
  const buildUserHomeFeed = async () => {
    setLoading(true)

    try {
      if (communityStateValue.userSnippets.length) {
        // Get posts from the user's communities
        const userCommunityIds = communityStateValue.userSnippets.map(
          (snippet) => snippet.communityId
        )
        const postsQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', userCommunityIds),
          limit(10)
        )
        const postsDocs = await getDocs(postsQuery)
        const posts = postsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }))
      } else {
        // If the user is not part of any community
        buildNoUserHomeFeed()
      }
    } catch (error) {
      console.log('Error in buildUserHomeFeed', error)
    }

    setLoading(false)
  }

  /** Feed for not signed in users */
  const buildNoUserHomeFeed = async () => {
    setLoading(true)

    try {
      // Fetching most popular posts based on their vote status
      const postsQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      )
      const postsDocs = await getDocs(postsQuery)
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

  /** Do Y */
  useEffect(() => {
    if (communityStateValue.snippetsFetched) {
      buildUserHomeFeed()
    }
  }, [communityStateValue.snippetsFetched])

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
