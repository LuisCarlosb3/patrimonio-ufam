import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { pages } from './routes';

import Sidebar from '../../presentation/components/Sidebar';
import { Wrapper, Main } from '../../presentation/styles/Layout/styles';

const Routes: React.FC = () => (
  <Wrapper>
    <Sidebar />
    <Main>
      <Switch>
        {pages.map(
          (page) =>
            !page.isPrivate && (
              <Route
                key={page.id}
                path={page.path}
                exact
                component={page.component}
              />
            ),
        )}
      </Switch>
    </Main>
  </Wrapper>
);

export default Routes;
