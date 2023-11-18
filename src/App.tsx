// Libs
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// Components
import { ProtectedRoute } from '~/components/common';
import NotFoundPage from '~/components/common/notFound/NotFound';
import { Login } from '~/pages';
// Shares
import React, { Suspense } from 'react';
import { AdminProtectedPath, RouterPaths } from '~/utils/enum';
import { LoadingInfiniteScroll } from './components/specific';
import LayoutPanel from './layouts/LayoutPanel';
import { useAppSelector } from './redux/hooks';
import { selectAccessToken } from './thunks/auth/authSlice';
import { routers } from './utils/routers/routers';

type Props = {};

const App = (props: Props) => {
  const accessToken = useAppSelector(selectAccessToken);

  const handleRenderWithSuspenseFallback = (component: React.ReactNode) => {
    return <Suspense fallback={<LoadingInfiniteScroll />}>{component}</Suspense>;
  };

  const handleRenderComponentLogin = () => {
    if (accessToken) {
      return <Navigate to={RouterPaths.MAIN} replace />;
    }
    return handleRenderWithSuspenseFallback(<Login />);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={RouterPaths.MAIN} element={<Navigate to={'/' + AdminProtectedPath.DASHBOARD.path} replace />} />
          <Route path={RouterPaths.MAIN} element={<ProtectedRoute ComponentProtected={LayoutPanel} />}>
            {routers.map((item) => (
              <Route key={item.path} path={item.path} element={handleRenderWithSuspenseFallback(<ProtectedRoute ComponentProtected={item?.component} />)} />
            ))}
          </Route>
          <Route path={RouterPaths.LOGIN} element={handleRenderComponentLogin()} />
          <Route path={'*'} element={handleRenderWithSuspenseFallback(<NotFoundPage />)} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
