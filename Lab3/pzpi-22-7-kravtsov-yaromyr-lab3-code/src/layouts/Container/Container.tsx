import React, { FC, ReactNode } from 'react'
import styles from './Container.module.css'
interface Props{
    children: ReactNode;
    className?: string
}
const Container:FC<Props> = ({children, className}) => {
  return (
    <div className={`${styles.container} ${className}`}>
        {children}
    </div>
  )
}

export default Container
