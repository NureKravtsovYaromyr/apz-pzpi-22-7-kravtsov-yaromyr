import React, { FC, ReactNode, useEffect } from 'react';
import styles from './PopUpMenu.module.css';

type TPopUpSize = 'big' | 'normal';

interface PopUpMenuProps {
    children: ReactNode;
    title?: string;
    show: boolean;
    onSubmit?: () => void;
    submitButtonTitle?: string;
    closeButtonTitle?: string;
    onCloseButtonClick?: () => void;
    setShow: (show: boolean) => void;
    size?: TPopUpSize;
    disappear?: number; // Время в секундах, через которое окно закроется автоматически
    empty?: boolean;
    className?: string
}

const PopUpMenu: FC<PopUpMenuProps> = ({
    children,
    title,
    show,
    onSubmit,
    submitButtonTitle,
    closeButtonTitle,
    setShow,
    onCloseButtonClick,
    size,
    disappear,
    empty,
    className
}) => {
    useEffect(() => {
        if (show && disappear && disappear !== -1) {
            const timer = setTimeout(() => {
                setShow(false);
                onCloseButtonClick && onCloseButtonClick();
            }, disappear * 1000);

            return () => clearTimeout(timer);
        }

    }, [show, disappear, onCloseButtonClick, setShow]);

    // Обработчик клика по контейнеру (фону)
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Если клик был непосредственно по контейнеру (а не по дочернему элементу)
        if (e.target === e.currentTarget) {
            setShow(false);
            onCloseButtonClick && onCloseButtonClick();
        }
    };

    if (empty) {
        return (
            <div
                className={`${styles.popUpContainer} ${show ? styles.show : ''}`}
                onClick={handleContainerClick}
            >

                <div className={`${styles.popUp} ${className} ${size === 'big' ? styles.big : ''}`}>{children}</div>
            </div>
        )
    }
    return (
        <div
            className={`${styles.popUpContainer} ${show ? styles.show : ''}`}
            onClick={handleContainerClick}
        >
            <div className={`${styles.popUp} ${size === 'big' ? styles.big : ''}`}>

                <div className={styles.title}>{title}</div>
                <div className={styles.body}>
                    {children}
                </div>
                {submitButtonTitle && (
                    <button className={styles.button} onClick={onSubmit}>
                        {submitButtonTitle}
                    </button>
                )}
                {disappear === -1 && (
                    <button
                        className={`${styles.button} ${styles.close}`}
                        onClick={() => {
                            setShow(false);
                            onCloseButtonClick && onCloseButtonClick();
                        }}
                    >
                        {closeButtonTitle}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PopUpMenu;
