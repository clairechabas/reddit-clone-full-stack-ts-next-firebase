import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '../ui/theme'

import Navbar from '@/components/Navbar/Navbar'
import { RecoilRoot } from 'recoil'

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <>
          <Navbar />
          <Component {...pageProps} />
        </>
      </ChakraProvider>
    </RecoilRoot>
  )
}

export default App
