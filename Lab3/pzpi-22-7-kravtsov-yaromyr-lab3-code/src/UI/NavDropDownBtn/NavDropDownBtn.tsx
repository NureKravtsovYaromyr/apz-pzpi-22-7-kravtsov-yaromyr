import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './NavDropDownBtn.module.css';
import { RouteNames } from '../../app/router';
import navListIcon from '../../assets/images/nav-list.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export interface DropDownListItem {
    title: string,
    link: RouteNames
}

interface NavDropDownBtnProps {
    dropDownList: DropDownListItem[]
}

const NavDropDownBtn: FC<NavDropDownBtnProps> = ({ dropDownList }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(false);
    const navButtonRef = useRef<HTMLDivElement>(null);

    const updateIsActive = () => {
        const isCurrentPathActive = dropDownList.some(el => el.link === location.pathname);
        setIsActive(isCurrentPathActive);
    };

    useEffect(() => {
        updateIsActive();
    }, [location.pathname, dropDownList]);

    const handleBtnClick = () => {
        setIsShow(!isShow);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (navButtonRef.current && !navButtonRef.current.contains(event.target as Node)) {
            setIsShow(false);
        }
    };

    useEffect(() => {
        if (isShow) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShow]);

    return (
        <div
            ref={navButtonRef}
            className={`${styles.navButton} ${isActive ? styles.active : ''}`}
            onClick={handleBtnClick}
        >
            <img src={navListIcon} alt="" className={styles.navIcon} />
            <div className={`${styles.dropDown} ${isShow && styles.show}`}>
                {dropDownList.map((dropDownItem, index) => (
                    <Link to={dropDownItem.link} key={index} className={styles.dropDownItem}>
                        {dropDownItem.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NavDropDownBtn;
