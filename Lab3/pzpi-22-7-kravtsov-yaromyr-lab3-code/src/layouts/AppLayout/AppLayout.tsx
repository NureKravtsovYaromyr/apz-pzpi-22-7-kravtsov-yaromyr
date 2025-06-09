import React, { FC, ReactNode } from 'react'

import styles from './AppLayout.module.css'
import Header from '../Header/Header'
interface Props {
  children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.pageRow}>
        {children}
      </div>
    </div>
  )
}

export default AppLayout
