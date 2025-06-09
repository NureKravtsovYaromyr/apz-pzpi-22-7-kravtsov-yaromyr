import React from 'react';

interface Props {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<Props> = ({ checked = false, onChange }) => {

    const handleClick = () => {
        if (onChange) {
            onChange(!checked); // Инвертируем состояние чекбокса
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            {checked ?
                <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 17C32 25.2843 25.2843 32 17 32C8.71573 32 2 25.2843 2 17C2 8.71573 8.71573 2 17 2C25.2843 2 32 8.71573 32 17Z" fill="#F6F6F6" stroke="#323232" strokeWidth="3" />
                    <path d="M12 17.0013L14.8047 19.806C15.0967 20.098 15.57 20.098 15.862 19.806L22 13.668" fill="#F6F6F6" />
                    <path d="M12 17.0013L14.8047 19.806C15.0967 20.098 15.57 20.098 15.862 19.806L22 13.668" stroke="#323232" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                :
                <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 17C32 25.2843 25.2843 32 17 32C8.71573 32 2 25.2843 2 17C2 8.71573 8.71573 2 17 2C25.2843 2 32 8.71573 32 17Z" stroke="#323232" strokeWidth="3" />
                </svg>
            }
        </div>
    );
};

export default Checkbox;
