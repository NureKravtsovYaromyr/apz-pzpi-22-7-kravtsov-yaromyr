import React, { FC, ReactNode } from 'react';
import styles from './MyButton.module.css'
interface MyButton{
    onClick?: () => void;
    children: ReactNode;
    className?:string;
    disabled?: boolean
}
const MyButton:FC<MyButton> = (props) => {
  return (
    <button className={`${styles.button} ${props.className}`} onClick={props.onClick} disabled = {props.disabled}>
      {props.children}
    </button>
  )
}

export default MyButton
