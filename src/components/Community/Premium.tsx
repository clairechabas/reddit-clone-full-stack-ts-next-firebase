import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { GiCheckedShield } from 'react-icons/gi'
import React from 'react'

const Premium: React.FC = () => {
  return (
    <Flex
      direction="column"
      bg="white"
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      p="12px"
    >
      <Flex mb={2}>
        <Icon as={GiCheckedShield} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>Reddit Premium</Text>
          <Text>The best Reddit experience, with monthly Coins</Text>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100">
        Try Now
      </Button>
    </Flex>
  )
}
export default Premium
