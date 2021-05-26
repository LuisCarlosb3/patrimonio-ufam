import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '../infra/routes';
import RouteLogin from '../infra/routes/RouteLogin';
import GlobalStyles from '../presentation/styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Routes />
      {/* <RouteLogin /> */}
    </Router>
  );
};

export default App;
