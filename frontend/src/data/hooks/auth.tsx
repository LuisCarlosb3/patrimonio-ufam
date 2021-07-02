import React, { useContext, createContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth, AuthState } from '../protocols/user';
import { AxiosHttpClient } from '../../infra/http/axios-http-client';
import { useToast } from './toast';

const AuthContextData = createContext<Auth>({} as Auth);

const AuthContext: React.FC = ({ children }) => {
  const history = useHistory();
  const { addToast } = useToast();

  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@Patrimonio:user');

    if (user) {
      return { user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ registration, password }) => {
      const httpClient = new AxiosHttpClient();

      try {
        const { body, statusCode } = await httpClient.request({
          url: 'login',
          method: 'post',
          body: { registration, password },
        });

        const userData = {
          name: body.userData.name,
          token: body.token,
          permission: body.userData.permission,
        };

        if (statusCode === 200) {
          localStorage.setItem('@Patrimonio:user', JSON.stringify(userData));

          setData({ user: userData });

          history.push('/home');
        }
      } catch (error) {
        addToast({
          title: 'Erro',
          type: 'error',
          message: 'Erro ao validar credenciais',
        });
      }
    },
    [history, addToast],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@Patrimonio:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContextData.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContextData.Provider>
  );
};

export function useAuth(): Auth {
  const context = useContext(AuthContextData);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
