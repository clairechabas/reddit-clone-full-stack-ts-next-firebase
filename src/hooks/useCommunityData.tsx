import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  Community,
  CommunitySnippet,
  communityState,
} from '../atoms/communitiesAtom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../firebase/clientApp'
import {
  getDocs,
  collection,
  writeBatch,
  doc,
  increment,
} from 'firebase/firestore'
import { authModalState } from '../atoms/authModalAtom'

const useCommunityData = () => {
  const [user] = useAuthState(auth)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handling switch between leaving/joining community
   * @param communityData
   * @param isJoined
   * @returns
   */
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // If user is not signed in open login modal
    if (!user) {
      setAuthModalState({ open: true, view: 'logIn' })
      return
    }

    if (isJoined) {
      leaveCommunity(communityData.id)
      return
    }

    joinCommunity(communityData)
  }

  /**
   * Get a user's community snippets
   */
  const getUserSnippets = async () => {
    setLoading(true)

    try {
      // Get user snippets
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      )
      const snippets = snippetsDocs.docs.map((doc) => ({ ...doc.data() }))

      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: snippets as CommunitySnippet[],
      }))
    } catch (error: any) {
      console.log('Error in getUserSnippets', error)
      setError(error.message)
    }

    setLoading(false)
  }

  /**
   * User joins community
   * @param communityData
   */
  const joinCommunity = async (communityData: Community) => {
    setLoading(true)

    try {
      // Create a new community snippet
      const batchWrite = writeBatch(firestore)
      const newSnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || '',
      }
      batchWrite.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      )

      // Update the community's number of members
      batchWrite.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      })
      await batchWrite.commit()

      // update recoil state communityState.userSnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: [...prev.userSnippets, newSnippet],
      }))
      setLoading(false)
    } catch (error: any) {
      console.log('Error in joinCommunity', error)
      setError(error.message)
    }
  }

  /**
   * Use leaves community
   * @param communityId
   */
  const leaveCommunity = async (communityId: string) => {
    setLoading(false)

    try {
      const batchWrite = writeBatch(firestore)

      // Detele the user community snippet
      batchWrite.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      )

      // Update the community's number of members
      batchWrite.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      })

      await batchWrite.commit()

      // update recoil state communityState.userSnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: prev.userSnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }))
    } catch (error: any) {
      console.log('Error in leaveCommunity', error)
      setError(error.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    /** Clearing users' community snippets on logout */
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: [],
      }))

      return
    }

    getUserSnippets()
  }, [user])

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  }
}
export default useCommunityData
