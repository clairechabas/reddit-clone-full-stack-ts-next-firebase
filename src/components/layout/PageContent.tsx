import { Flex } from '@chakra-ui/react'
import React from 'react'

type PageContentProps = {
  children: React.ReactNode[]
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const [left, right] = children

  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth="860px">
        {/* Left Side */}
        <Flex
          direction="column"
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
        >
          {left}
        </Flex>

        {/* Right Side */}
        <Flex
          direction="column"
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
        >
          {right}
        </Flex>
      </Flex>
    </Flex>
  )
}
export default PageContent
