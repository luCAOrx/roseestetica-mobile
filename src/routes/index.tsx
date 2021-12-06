import React from 'react';

import { useAuth } from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

export default function Routes() {
  const {cliente} = useAuth();

  return cliente ? <AppRoutes /> : <AuthRoutes />;
}