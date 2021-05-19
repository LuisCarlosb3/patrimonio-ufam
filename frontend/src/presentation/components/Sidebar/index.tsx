import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter, useHistory } from 'react-router-dom';

import { pages } from '../../../infra/routes/routes';
import Icon from '../Icon';
import logo from '../../../assets/logo.svg';

import { Container, Content, Link, Logo } from './styles';

const Sidebar: React.FC<RouteComponentProps> = ({ location }) => {
  const history = useHistory();

  const handleNavigate = () => {
    history.push('/');
  };

  return (
    <Container>
      <Logo onClick={handleNavigate}>
        <img src={logo} alt="Oráculo" />
      </Logo>
      <Content>
        {pages.map(
          (page) =>
            !page.isPrivate &&
            page.nav && (
              <Link
                key={page.id}
                to={page.path}
                active={location.pathname === page.path ? 1 : 0}
              >
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
            ),
        )}
      </Content>
    </Container>
  );
};

export default withRouter(Sidebar);
