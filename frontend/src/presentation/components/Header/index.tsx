import React from 'react';
import { Container } from './styles';
import { useAuth } from '../../../data/hooks/auth';
import { ReactComponent as ProfileIcon } from '../../../assets/Profile.svg';
import { autoCapitalize } from '../../../data/utils/formats';

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
        {action && user?.permission === 2 && (
          <button className="btn-action" onClick={action} type="button">
            +
          </button>
        )}

        <div className="user-data">
          <div>
            <ProfileIcon />
            <h4>{autoCapitalize(user.name)}</h4>
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
