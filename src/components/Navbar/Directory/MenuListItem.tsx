import useDirectory from '@/hooks/useDirectory'
import { Flex, MenuItem, Image, Icon } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { IconType } from 'react-icons'

type MenuListItemProps = {
  displayText: string
  link: string
  icon: IconType
  iconColor: string
  imageUrl?: string
}

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageUrl,
}) => {
  const { onSelectMenuItem } = useDirectory()

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: 'gray/100' }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imageUrl })
      }
    >
      <Flex align="center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            borderRadius="full"
            boxSize="18px"
            mr={2}
            alt="Community Image"
          />
        ) : (
          <Icon as={icon} fontSize={20} color={iconColor} mr={2} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  )
}
export default MenuListItem
