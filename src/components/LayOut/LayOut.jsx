import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { ScrollProgress, BackToTop, PageLoader } from '../ui'
import styles from './Layout.module.css'

const LayOut = ({ children }) => {
  return (
    <>
      <PageLoader />
      <div className={styles.layout}>
        <ScrollProgress />
        <Navbar/>
        <main className={styles.main}>
          {children}
        </main>
        <Footer/>
        <BackToTop />
      </div>
    </>
  )
}

export default LayOut