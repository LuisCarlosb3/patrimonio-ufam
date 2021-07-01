import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RouteConfig from './Route';

import Sidebar from '../../presentation/components/Sidebar';
import { Wrapper, Main } from '../../presentation/styles/Layout/styles';

import Login from '../../presentation/pages/Login';
import Home from '../../presentation/pages/Home';
import Search from '../../presentation/pages/Search';
import Report from '../../presentation/pages/Report';
import Users from '../../presentation/pages/Users';
import Patrimony from '../../presentation/pages/Patrimony';

const NotFoundComponent = () => {
  return <div>URL Not Found</div>;
};

const Routes: React.FC = () => (
  <Wrapper>
    <Sidebar />
    <Main>
      <Switch>
        <RouteConfig path="/" exact component={Login} />
        <RouteConfig path="/home" exact component={Home} isPrivate />
        <RouteConfig path="/search" exact component={Search} isPrivate />
        <RouteConfig path="/report" exact component={Report} isPrivate />
        <RouteConfig path="/users" exact component={Users} isPrivate />
        <RouteConfig path="/patrimony" exact component={Patrimony} isPrivate />
        <Route path="/notfound" exact component={NotFoundComponent} />
        <Route>
          <Redirect to="/notfound" />
        </Route>
      </Switch>
    </Main>
  </Wrapper>
);

export default Routes;
