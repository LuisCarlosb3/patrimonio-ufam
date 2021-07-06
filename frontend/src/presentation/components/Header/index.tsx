import React from 'react';
import { Container } from './styles';
import { useAuth } from '../../../data/hooks/auth';
import { ReactComponent as ProfileIcon } from '../../../assets/Profile.svg';

interface IHeader {
  title: string;
  action?: () => void;
}

const Header: React.FC<IHeader> = ({ title, action }) => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <h1>{title}</h1>

      <div className="info-header">
        {action && (
          <button className="btn-action" onClick={action} type="button">
            +
          </button>
        )}

        <div className="user-data">
          <div>
            <ProfileIcon />
            <h4>{user.name.toLocaleUpperCase()}</h4>
          </div>

          <button type="button" onClick={signOut}>
            Desconectar
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Header;
