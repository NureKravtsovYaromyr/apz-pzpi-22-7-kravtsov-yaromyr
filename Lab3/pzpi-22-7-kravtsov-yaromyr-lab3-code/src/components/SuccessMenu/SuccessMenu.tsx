import React from 'react';
import PopUpMenu from '../../UI/PopUpMenu/PopUpMenu';
import styles from './SuccessMenu.module.css'
import MyButton from '../../UI/MyButton/MyButton';
interface Props {
    isShow: boolean;
    setIsShow: (val: boolean) => void;
    title: string,
    action: () => void
}

const SuccessMenu: React.FC<Props> = ({ isShow, setIsShow, title ,action}) => {

    return (
        <PopUpMenu empty show={isShow} setShow={setIsShow} className={styles.popUp} >
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" width="64" height="64" rx="32" fill="#61C478" />
                <path d="M25.1133 40.8199L17.6572 33.3691C17.2554 32.9676 16.7105 32.7421 16.1423 32.7421C15.5742 32.7421 15.0292 32.9676 14.6275 33.3691C14.2257 33.7706 14 34.3151 14 34.8829C14 35.164 14.0554 35.4424 14.1631 35.7021C14.2707 35.9619 14.4285 36.1979 14.6275 36.3967L23.6092 45.3719C24.4472 46.2094 25.8009 46.2094 26.6389 45.3719L49.3725 22.6546C49.7743 22.2531 50 21.7086 50 21.1408C50 20.573 49.7743 20.0285 49.3725 19.627C48.9708 19.2255 48.4258 19 47.8577 19C47.2895 19 46.7446 19.2255 46.3428 19.627L25.1133 40.8199Z" fill="white" />
            </svg>
            <div className='popUpTitle'>{title}</div>
            <MyButton onClick={action} className={styles.button} >
                Schließen
            </MyButton>
        </PopUpMenu>
    );
};

export default SuccessMenu;