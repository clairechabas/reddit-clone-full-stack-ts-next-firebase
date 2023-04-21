import { ChakraProvider } from '@chakra-ui/react'
import AppProps from 'next/app'
import { theme } from '../ui/theme'

import Layout from '@/components/Layout'
import { RecoilRoot } from 'recoil'

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  )
}

export default App
