import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter, useHistory } from 'react-router-dom';
import { config, useSpring } from 'react-spring';
import useSidebar from '../../../infra/routes/getRoutes';
import Icon from '../Icon';
import logo from '../../../assets/logo.svg';

import { Container, Content, Link, Logo, NavZin } from './styles';

const Sidebar: React.FC<RouteComponentProps> = ({ location }) => {
  const history = useHistory();
  const [fadeIn, set] = useSpring(() => ({
    height: '0px',
    transform: 'scaleY(0)',
  }));
  const [tab, setTab] = useState('/home');

  const pages = useSidebar();

  React.useEffect(() => {
    set({
      from: { height: '0px', transform: 'scaleY(0)' },
      to: { height: '32px', transform: 'scaleY(1)' },
      config: { ...config.stiff },
    });
  }, [set, tab]);

  const handleNavigate = () => {
    history.push('/');
  };

  return (
    <Container isVisible={!['/', '/notfound'].includes(location.pathname)}>
      <Logo onClick={handleNavigate}>
        <img src={logo} alt="Oráculo" />
      </Logo>
      <Content>
        {pages.map(
          (page) =>
            page.nav && (
              <Link
                key={page.id}
                to={page.path}
                active={location.pathname === page.path ? 1 : 0}
                onClick={() => setTab(page.path)}
                disabled={!!page.block}
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
                {location.pathname === page.path && (
                  <NavZin style={fadeIn} height="0px" />
                )}
              </Link>
            ),
        )}
      </Content>
    </Container>
  );
};

export default withRouter(Sidebar);
