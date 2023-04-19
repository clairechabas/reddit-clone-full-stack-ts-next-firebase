import { Post } from '@/src/atoms/postAtom'
import PageContent from '@/src/components/Layout/PageContent'
import PostItem from '@/src/components/Posts/PostItem'
import { auth, firestore } from '@/src/firebase/clientApp'
import usePosts from '@/src/hooks/usePosts'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const PostPage: React.FC = () => {
  const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts()
  const [user] = useAuthState(auth)
  const router = useRouter()

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId)
      const postDoc = await getDoc(postDocRef)
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }))
    } catch (error) {
      console.log('Error in fetchPost', error)
    }
  }

  useEffect(() => {
    // Do wee need to fetch the post
    // meaning the user is not coming from the community page
    const { pid } = router.query

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string)
    }
  }, [router.query, postStateValue.selectedPost])

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        {/* Comments */}
      </>

      <>{/* About */}</>
    </PageContent>
  )
}

export default PostPage
