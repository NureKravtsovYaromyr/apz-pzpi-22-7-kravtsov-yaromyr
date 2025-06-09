import React from 'react';
import styles from './RemoveButton.module.css'
interface Props {
    action: () => void
}

const RemoveButton: React.FC<Props> = ({ action }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  action();
};

    return (
        <button
            onClick={handleClick}
            className={styles.button}
        >
            <svg width="23" height="27" viewBox="0 0 23 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6.83333H22M16.75 6.83333V2.83333C16.75 2.47971 16.6117 2.14057 16.3656 1.89052C16.1195 1.64048 15.7856 1.5 15.4375 1.5H7.5625C7.2144 1.5 6.88056 1.64048 6.63442 1.89052C6.38828 2.14057 6.25 2.47971 6.25 2.83333V6.83333H16.75ZM19.375 24.1667V6.83333H3.625V24.1667C3.625 24.5203 3.76329 24.8595 4.00942 25.1095C4.25556 25.3595 4.5894 25.5 4.9375 25.5H18.0625C18.4106 25.5 18.7445 25.3595 18.9906 25.1095C19.2367 24.8595 19.375 24.5203 19.375 24.1667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    );
};

export default RemoveButton;