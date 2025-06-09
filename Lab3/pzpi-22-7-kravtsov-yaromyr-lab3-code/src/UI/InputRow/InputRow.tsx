import React, { ReactNode } from 'react';
import styles from './InputRow.module.css'
import MyInput from '../MyInput/MyInput';
interface Props {
  children?: ReactNode,
  title: string,
  className?:string
}

const InputRow: React.FC<Props> = (props) => {
  return (
    <div className={`${styles.row} ${props.className}`}>
      <p className={styles.title}>{props.title}</p>
      {props.children}
    </div>
  );
};

export default InputRow;