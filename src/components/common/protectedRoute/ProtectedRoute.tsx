// Libs
import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
// Shares
import { ExactPath, StorageConstants } from '~/utils/enum';

type Props = {
  ComponentProtected: React.ElementType;
};

const ProtectedRoute: FC<Props> = (props: Props) => {
  const { ComponentProtected } = props;
  const accessToken = localStorage.getItem(StorageConstants.ACCESS_TOKEN)!;

  return accessToken ? <ComponentProtected /> : <Navigate to={ExactPath.auth.login} />;
};

export default ProtectedRoute;
