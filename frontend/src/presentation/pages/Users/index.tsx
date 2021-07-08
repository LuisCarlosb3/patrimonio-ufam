import React, { useCallback, useState } from 'react';
import { Form } from '@unform/web';
import { usePatrimony } from '../../../data/hooks/contexts/patrimony';
import { useToast } from '../../../data/hooks/toast';
import Header from '../../components/Header';
import Dropdown from '../../components/Dropdown';
import { Container } from '../../styles/Layout/styles';
import {
  ModalContent,
  ItemInput,
  InputForm,
  Title,
  Content,
  Row,
} from './styles';
import { IUser } from '../../../data/hooks/contexts/patrimony/types';

const dropItems = ['Administrador', 'Inventariante'];

const Users: React.FC = () => {
  const [selectState, setSelectState] = useState('');

  const { createUser } = usePatrimony();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: IUser, { reset }) => {
      if (selectState === '') {
        addToast({
          title: 'Info',
          message: 'Selecione uma permissão',
          type: 'warning',
        });
        return;
      }
      const newData: IUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        registration: data.registration,
        permission: selectState === 'Administrador' ? 2 : 1,
      };

      createUser(newData);
      reset();
    },
    [selectState, createUser, addToast],
  );

  return (
    <Container>
      <Header title="Usuários" />

      <ModalContent>
        <div className="header">
          <h1 style={{ color: '#14142B' }}>Novo Usuário </h1>
        </div>

        <Form onSubmit={handleSubmit}>
          <ItemInput>
            <Title>Nome</Title>
            <InputForm required name="name" type="text" alt="Nome" />
          </ItemInput>
          <ItemInput>
            <Title>Matrícula</Title>
            <InputForm required name="registration" type="text" alt="Valor" />
          </ItemInput>
          <ItemInput>
            <Title>Email</Title>
            <InputForm required name="email" type="email" alt="Email" />
          </ItemInput>

          <ItemInput>
            <Title>Senha</Title>
            <InputForm
              required
              name="password"
              type="password"
              alt="Senha"
              autoComplete="current-password"
            />
          </ItemInput>

          <Row>
            <label>Permissão</label>
            <Dropdown
              show={false}
              value={selectState}
              items={dropItems}
              background="#eff0f6"
              onChange={(value) => setSelectState(value)}
            />
          </Row>

          <Content>
            <button className="button" type="submit">
              Salvar
            </button>
          </Content>
        </Form>
      </ModalContent>
    </Container>
  );
};

export default Users;
