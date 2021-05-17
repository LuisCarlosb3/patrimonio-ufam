import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { pages } from '../../../infra/routes/routes';
import Icon from '../Icon';

import { Container, Content, Link } from './styles';

const Sidebar: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Container>
      <div>
        {pages.map((page) => (
          <Content key={page.id}>
            <Link to={page.path} activeRoute={location.pathname === page.path}>
              {page.icon && (
                <Icon
                  icon={page.icon}
                  size={24}
                  color={
                    location.pathname === page.path ? '#5F2EEA' : '#A0A3BD'
                  }
                  stroke={location.pathname === page.path ? 1.8 : 1.2}
                />
              )}
              {page.name}
            </Link>
          </Content>
        ))}
      </div>
    </Container>
  );
};

export default withRouter(Sidebar);
