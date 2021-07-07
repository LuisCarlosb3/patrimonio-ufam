import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from '../data/hooks/auth';
import ToastProvider from '../data/hooks/toast';
import PatrimonyProvider from '../data/hooks/contexts/patrimony';

import Routes from '../infra/routes';
import GlobalStyles from '../presentation/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <ToastProvider>
        <AuthProvider>
          <PatrimonyProvider>
            <Routes />
          </PatrimonyProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
