import React from 'react'
import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { RouteNames } from '../../app/router'
import { useAuthStore } from '../../app/store/auth'
const Header = () => {
    const {role, firstName, lastName, userId, profileImageUrl, logout} = useAuthStore()
    
  return (
    <div className={styles.header}>
        <Link to = {RouteNames.MAIN} className={styles.logo}>DevPlan</Link>
        <div className={styles.navBar}>
                <Link to={RouteNames.BUILDINGS}>Забудівлі</Link>
                <Link to={RouteNames.ZONES}>Зони</Link>
                <Link to={RouteNames.DOORS}>Двері</Link>
                <Link to={RouteNames.USERS}>Мешканці</Link>


                
        </div>
        <div onClick={logout}>logout</div>
        <Link className={styles.account} to={`${RouteNames.USER}/${userId}`}>
            <div className={styles.column}>
                    <div className={styles.name}>{firstName + " " + lastName}</div>
                    <div className={styles.role}>{role == 'developer' ? 'Забудовник': 'Мешканець'}</div>
            </div>
            
 
        </Link>
    </div>
  )
}

export default Header
