import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import { ReactComponent as Logo } from '../../../assets/LogoOraculo.svg';
import { ReactComponent as Undraw } from '../../../assets/undraw_performance.svg';
import { ReactComponent as Profile } from '../../../assets/Profile.svg';
import { ReactComponent as Lock } from '../../../assets/Lock.svg';
import { useAuth } from '../../../data/hooks/auth';

import {
  Head,
  Body,
  Title,
  Ilustration,
  InputForm,
  ItemInput,
  Span,
  Button,
  BodyForm,
} from './styles';

export interface SignInCredentials {
  registration: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    (data: SignInCredentials) => {
      signIn({
        registration: data.registration,
        password: data.password,
      });
    },
    [signIn],
  );

  return (
    <Head>
      <Body>
        <BodyForm>
          <Logo width={180} height={180} />
          <Form onSubmit={handleSubmit}>
            <Title>Acesso</Title>
            <ItemInput>
              <Profile
                style={{
                  position: 'absolute',
                  top: '1.8rem',
                  left: '1.5rem',
                  width: '2rem',
                  height: '2rem',
                }}
              />
              <InputForm
                name="registration"
                type="text"
                alt="Input Login"
                placeholder="Matrícula"
              />
            </ItemInput>
            <ItemInput>
              <Lock
                style={{
                  position: 'absolute',
                  top: '1.8rem',
                  left: '1.5rem',
                  width: '2rem',
                  height: '2rem',
                }}
              />
              <InputForm
                name="password"
                type="password"
                alt="Input Senha"
                placeholder="Senha"
              />
            </ItemInput>
            <Span>Esqueci Minha Senha</Span>
            <Button type="submit">Entrar</Button>
          </Form>
        </BodyForm>
      </Body>
      <Ilustration>
        <Undraw width={380} height={380} />
      </Ilustration>
    </Head>
  );
};

export default Login;
