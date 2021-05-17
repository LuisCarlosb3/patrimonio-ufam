import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '../infra/routes';
import GlobalStyles from '../presentation/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Routes />
    </Router>
  );
};

export default App;
