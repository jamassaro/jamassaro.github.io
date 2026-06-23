import React from 'react'
import { Navbar, Footer } from '../layout'
import { ScrollProgress, BackToTop, PageLoader } from '../ui'
import styles from '../layout/Layout.module.css'

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