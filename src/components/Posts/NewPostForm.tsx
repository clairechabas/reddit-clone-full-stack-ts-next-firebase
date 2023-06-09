import { firestore, storage } from '@/firebase/clientApp'
import useSelectFile from '@/hooks/useSelectFile'
import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import ImageUpload from './ImageUpload'
import Tab from './Tab'
import TextInputs from './TextInputs'

type NewPostFormProps = {
  user: User
  communityImageUrl?: string
}

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
]

export type TabItem = {
  title: string
  icon: typeof Icon.arguments
}

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageUrl,
}) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  })
  const { selectedFile, setSelectedFile, handleSelectFile } = useSelectFile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleCreatePost = async () => {
    const { communityId } = router.query

    setLoading(true)

    try {
      // Store new post in `posts` collection in Firebase
      const postDocRef = await addDoc(collection(firestore, 'posts'), {
        communityId: communityId as string,
        communityImageUrl: communityImageUrl || '',
        creatorId: user.uid,
        creatorDisplayName: user.email!.split('@')[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
      })

      // Store post image if there's one
      if (selectedFile) {
        // Store post image in Firebase storage
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, 'data_url')

        // Update post document with the `imageUrl` from Firebase storage
        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(postDocRef, {
          imageUrl: downloadUrl,
        })
      }

      setSelectedFile('')
      setTextInputs({ title: '', body: '' })

      // Redirect to community page
      router.back()
    } catch (error: any) {
      console.log('Error in handleCreatePost', error.message)
      setError(true)
    }

    setLoading(false)
  }

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <Tab
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>

      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleChange={handleTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}

        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={handleSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  )
}
export default NewPostForm
