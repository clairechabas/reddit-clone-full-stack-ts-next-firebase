import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  DirectoryMenuItem,
  directoryMenuState,
} from '../atoms/directoryMenuAtom'
import { useRouter } from 'next/router'
import { communityState } from '../atoms/communitiesAtom'
import { FaReddit } from 'react-icons/fa'

const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState)
  const communityStateValue = useRecoilValue(communityState)
  const router = useRouter()

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }))
  }

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }))

    router.push(menuItem.link)

    // Close the directory menu
    if (directoryState.isOpen) {
      toggleMenuOpen()
    }
  }

  /**
   * Setting the directory menu to adapt to the current
   * community on page refresh
   */
  useEffect(() => {
    const { currentCommunity } = communityStateValue

    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageUrl: currentCommunity.imageUrl,
          icon: FaReddit,
          iconColor: 'blue.500',
        },
      }))
    }
  }, [communityStateValue.currentCommunity])

  return { directoryState, toggleMenuOpen, onSelectMenuItem }
}
export default useDirectory
