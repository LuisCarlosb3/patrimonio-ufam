import React from 'react';
import { Form } from '@unform/web';
import { ReactComponent as Logo } from '../../../assets/LogoOraculo.svg';
import { ReactComponent as Undraw } from '../../../assets/undraw_performance.svg';
import { ReactComponent as Profile } from '../../../assets/Profile.svg';
import { ReactComponent as Lock } from '../../../assets/Lock.svg';

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

const Login: React.FC = () => {
  return (
    <Head>
      <Body>
        <BodyForm>
          <Logo />
          <Title>Acesso</Title>
          <Form onSubmit={() => console.log('data')}>
            <ItemInput>
              <Profile
                style={{
                  position: 'absolute',
                  top: '0.8rem',
                  left: '1.5rem',
                  width: '2rem',
                  height: '2rem',
                }}
              />
              <InputForm
                name="text"
                type="text"
                alt="Input Login"
                placeholder="Matrícula"
              />
            </ItemInput>
            <ItemInput>
              <Lock
                style={{
                  position: 'absolute',
                  top: '0.8rem',
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
        <Undraw />
      </Ilustration>
    </Head>
  );
};

export default Login;
