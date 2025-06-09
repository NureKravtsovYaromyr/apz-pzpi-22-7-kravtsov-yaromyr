import React, { FC, ReactNode, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RouteNames, publicRoutes } from '../../router';
import Loader from '../../../UI/Loader/Loader';
import { useAuthStore } from '../../store/auth';
import { useWindowWidth } from '../../../hooks/useWindowWidth';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = (props) => {
    const isAuth = useAuthStore(state => state.loggedIn);
    const isLoading = useAuthStore(state => state.isLoading);
    const setIsLoading = useAuthStore(state => state.setIsLoading);

    const role = useAuthStore(state => state.role);
    const checkAuth = useAuthStore(state => state.checkAuth);

    const fetchCheckAuth = async() =>{
        const token = localStorage.getItem('token');
        if (token) {
          
            await checkAuth(); 
            await setIsLoading(false)
        }else{
            setIsLoading(false);
        }
        
    }
    useEffect(() => {
        fetchCheckAuth()
        
        
    }, []);

    useEffect(() => {
        console.log(isLoading, isAuth, role);
    }, [isAuth, role, isLoading]);

    if (isLoading) {
        return <Loader />;
    }
    
    if (!isLoading && isAuth && (role === 'developer' || role === 'resident')) {
        return <>{props.children}</>;
    }

    return (
        <Routes>
            {publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<Suspense fallback={<Loader />}><route.element /></Suspense>}
                />
            ))}

            <Route path="*" element={<Navigate to={RouteNames.LOGIN} replace />} />
        </Routes>
    );
};

export default AuthGuard;
