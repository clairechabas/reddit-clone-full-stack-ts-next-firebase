import React from 'react'
import { Post, postState } from '../atoms/postAtom'
import { useRecoilState } from 'recoil'
import { deleteObject, ref } from 'firebase/storage'
import { firestore, storage } from '../firebase/clientApp'
import { deleteDoc, doc } from 'firebase/firestore'

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState)

  const onVote = async () => {}

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

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  }
}
export default usePosts
