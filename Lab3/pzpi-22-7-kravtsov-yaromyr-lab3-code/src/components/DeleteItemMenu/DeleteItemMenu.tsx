import React from 'react';
import PopUpMenu from '../../UI/PopUpMenu/PopUpMenu';
import styles from './DeleteItemMenu.module.css'
import MyButton from '../../UI/MyButton/MyButton';
interface Props {
    isShow: boolean,
    setIsShow: (val: boolean) => void,
    title: string;
    action: () => void
}

const DeleteItemMenu: React.FC<Props> = ({ isShow, setIsShow, title, action }) => {
    const handleBack = () =>{
        setIsShow(false)
    }
    return (
        <PopUpMenu empty className={styles.popUp} show={isShow} setShow={setIsShow} >
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" width="64" height="64" rx="32" fill="#EA5455" />
                <path d="M42.5612 39.938C42.843 40.2198 43.0013 40.602 43.0013 41.0005C43.0013 41.399 42.843 41.7812 42.5612 42.063C42.2794 42.3448 41.8972 42.5031 41.4987 42.5031C41.1002 42.5031 40.718 42.3448 40.4362 42.063L32.4999 34.1242L24.5612 42.0605C24.2794 42.3423 23.8972 42.5006 23.4987 42.5006C23.1002 42.5006 22.718 42.3423 22.4362 42.0605C22.1544 41.7787 21.9961 41.3965 21.9961 40.998C21.9961 40.5995 22.1544 40.2173 22.4362 39.9355L30.3749 31.9992L22.4387 24.0605C22.1569 23.7787 21.9986 23.3965 21.9986 22.998C21.9986 22.5995 22.1569 22.2173 22.4387 21.9355C22.7205 21.6537 23.1027 21.4954 23.5012 21.4954C23.8997 21.4954 24.2819 21.6537 24.5637 21.9355L32.4999 29.8742L40.4387 21.9342C40.7205 21.6524 41.1027 21.4941 41.5012 21.4941C41.8997 21.4941 42.2819 21.6524 42.5637 21.9342C42.8455 22.216 43.0038 22.5982 43.0038 22.9967C43.0038 23.3953 42.8455 23.7775 42.5637 24.0592L34.6249 31.9992L42.5612 39.938Z" fill="white" />
            </svg>
            <div className='popUpTitle'>
                {title}
            </div>
            <div className={styles.buttomRow}>
                <MyButton onClick={action} className={styles.actionButton}>
                    Jetzt löschen
                </MyButton>

                <MyButton onClick={handleBack} className={styles.backButton}>
                Zurück
                </MyButton>
            </div>

        </PopUpMenu>
    );
};

export default DeleteItemMenu;