import React, { ReactNode } from 'react';
import styles from './ListIteam.module.css'
import { Link } from 'react-router-dom';
interface Props {
    children: ReactNode;
    className?: string;
    action?: () => void;
    link?: string
}

const ListIteam: React.FC<Props> = ({link,children ,className, action}) => {
    const handleAction = () =>{
        action && action()
    }
    return (
        <Link to = {link ?? ''} className={`${styles.iteam} ${className}`} onClick={handleAction}>
            {children}
        </Link>
    );
};

export default ListIteam;