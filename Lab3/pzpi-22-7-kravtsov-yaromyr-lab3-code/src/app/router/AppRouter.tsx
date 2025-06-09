import { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RouteNames, adminRoutes, publicRoutes, userRoutes, } from '.';
import Loader from '../../UI/Loader/Loader';
import { useAuthStore } from '../store/auth';



const AppRouter = () => {

    const role = useAuthStore(state => state.role)
    const isLoading = useAuthStore(state => state.isLoading)

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Routes>
          {role}
        {role === 'developer' && (
          <>
          {console.log('adminnadminnadminnadminnadminn')}
            {adminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<Suspense fallback={<Loader />}><route.element /></Suspense>}
              />
            ))}
            <Route path="*" element={<Navigate to={RouteNames.MAIN} replace />} />
          </>
        )}
      
        {role === 'resident' && (
          <>
            {userRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<Suspense fallback={<Loader />}><route.element /></Suspense>}
              />
            ))}
            <Route path="*" element={<Navigate to={RouteNames.MAIN} replace />} />
          </>
        )}
       <Route path="*" element={<Navigate to={RouteNames.LOGIN} replace />} />
        
      </Routes>
      
    );
};


export default AppRouter;
