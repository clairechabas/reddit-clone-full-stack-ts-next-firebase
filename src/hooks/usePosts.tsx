import React, { useEffect } from 'react'
import { Post, PostVote, postState } from '../atoms/postAtom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { deleteObject, ref } from 'firebase/storage'
import { auth, firestore, storage } from '../firebase/clientApp'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { communityState } from '../atoms/communitiesAtom'
import { authModalState } from '../atoms/authModalAtom'

const usePosts = () => {
  const [user] = useAuthState(auth)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [postStateValue, setPostStateValue] = useRecoilState(postState)
  const currentCommunity = useRecoilValue(communityState).currentCommunity

  const onVote = async (post: Post, vote: number, communityId: string) => {
    // If user is not signed in show login modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: 'logIn' })
      return
    }

    try {
      const { voteStatus } = post
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      )

      const batchWrite = writeBatch(firestore)
      const updatedPost = { ...post }
      const updatedPosts = [...postStateValue.posts]
      let updatedPostVotes = [...postStateValue.postVotes]
      let voteChange = vote

      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, 'users', `${user?.uid}/postVotes`)
        )
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        }

        batchWrite.set(postVoteRef, newVote)

        // Add/substract 1 to/from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote
        updatedPostVotes = [...updatedPostVotes, newVote]
      } else {
        // User has already voted and modifies his vote
        const postVoteRef = doc(
          firestore,
          'users',
          `${user?.uid}/postVotes/${existingVote.id}`
        )
        const isRemovingVote = existingVote.voteValue === vote

        if (isRemovingVote) {
          // Substract 1 from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          )

          // delete the postVote document
          batchWrite.delete(postVoteRef)

          voteChange += -1
        } else {
          // User is flipping his vote
          // Add/substract 2 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote

          // update the existing postVote document
          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          )
          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          }
          batchWrite.update(postVoteRef, {
            voteValue: vote,
          })

          voteChange = 2 * vote
        }
      }

      // Update post document
      const postRef = doc(firestore, 'posts', post.id)
      batchWrite.update(postRef, { voteStatus: voteStatus + voteChange })

      // Commit our writes
      await batchWrite.commit()

      // Update state in store
      const postIndex = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      )
      updatedPosts[postIndex] = updatedPost

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }))
    } catch (error) {
      console.log('Error in onVote', error)
    }
  }

  const onSelectPost = () => {}

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // 1. Check if post has an image in storage
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imageRef)
      }

      // 2. Delete post document from firestore
      const postDocRef = doc(firestore, 'posts', post.id!)
      await deleteDoc(postDocRef)

      // 3. Update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }))

      return true
    } catch (error) {
      return false
    }
  }

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, 'users', `${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    )

    const postVotesDocs = await getDocs(postVotesQuery)
    const postVotes = postVotesDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }))
  }

  /** Fetch the posts votes for the current community's posts */
  useEffect(() => {
    if (!user || !currentCommunity?.id) return

    getCommunityPostVotes(currentCommunity.id)
  }, [user, currentCommunity])

  /** Clear user posts votes on logout */
  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [user])

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  }
}
export default usePosts
