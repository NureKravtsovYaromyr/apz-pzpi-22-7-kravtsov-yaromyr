import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css'
import MyButton from '../../UI/MyButton/MyButton';
import RemoveButton from '../../UI/RemoveButton/RemoveButton';
interface Props {
    actionTitle: string,
    action: () => void;
    children: ReactNode;
    pageTitle: string;
    removeAction?: () => void;
    actionAccess?: boolean
}

const PageLayout: React.FC<Props> = ({ actionTitle, action, children, pageTitle, removeAction,actionAccess  = true}) => {
    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <h1 className='pageTitle'>{pageTitle}</h1>
                <div className={styles.buttonRow}>
                    {
                        (actionAccess && removeAction)  &&
                        <RemoveButton action={removeAction} />
                    }
                    {actionAccess && 
                    <MyButton className={styles.topButton} onClick={action}>
                        {actionTitle}
                    </MyButton>
                    }
                </div>

            </div>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout;