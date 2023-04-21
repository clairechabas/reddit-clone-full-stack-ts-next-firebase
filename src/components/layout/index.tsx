import React from 'react'
import Navbar from '../Navbar/Navbar'

export type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }): JSX.Element => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
