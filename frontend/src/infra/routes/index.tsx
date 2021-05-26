import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Sidebar from '../../presentation/components/Sidebar';
import { Wrapper, Main } from '../../presentation/styles/Layout/styles';

import Login from '../../presentation/pages/Login';

import { pages } from './getRoutes';

const NotFoundComponent = () => {
  return <div>URL Not Found</div>;
};

const Routes: React.FC = () => (
  <>
    <Wrapper>
      <Sidebar />
      <Switch>
        {pages.map(
          (page) =>
            !page.isPrivate && (
              <Route key={page.id} path={page.path} exact>
                <Main>{page.component}</Main>
              </Route>
            ),
        )}
        <Route path="/login" exact component={Login} />
        <Route path="/notfound" exact component={NotFoundComponent} />
        <Route>
          <Redirect to="/notfound" />
        </Route>
      </Switch>
    </Wrapper>
  </>
);

export default Routes;
