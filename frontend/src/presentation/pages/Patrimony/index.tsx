import React, { useState } from 'react';
import { Form } from '@unform/web';
import {
  Container,
  ModalContent,
  Header,
  FormGroup,
  ItemInput,
  InputForm,
  Title,
  Content,
} from './styles';
import { ReactComponent as ProfileIcon } from '../../../assets/Profile.svg';
import { ReactComponent as Close } from '../../../assets/close.svg';
import Modal from '../../components/Modal';

interface PatrimonyItens {
  name: string;
  localization: string;
  observation: string;
}

interface RegisterPatrimony {
  code: string;
  description: string;
  state: string;
  entryDate: string;
  lastConferenceData: string;
  value: string;
  patrimonyItens: Array<PatrimonyItens>;
}

const Patrimony: React.FC = () => {
  const [openModalCreate, setOpenModalCreate] = useState(true);
  return (
    <Container>
      <Header>
        <h1>Patrimônio</h1>
        <div className="user-data">
          <div>
            <ProfileIcon />
            <h4>Junior Albuquerque</h4>
          </div>

          <button
            type="button"
            onClick={() => {
              console.log('hello');
            }}
          >
            Desconectar
          </button>
        </div>
      </Header>

      <Modal open={openModalCreate} setOpen={setOpenModalCreate}>
        <ModalContent>
          <div className="header">
            <h1 style={{ color: '#14142B' }}>Cadastrar Item</h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <Form onSubmit={() => console.log('oia eu aqui!')}>
            {/* Primeira aparte  */}
            <FormGroup>
              <ItemInput>
                <Title>Código</Title>
                <InputForm name="Código" type="text" alt="Código" />
              </ItemInput>
              <ItemInput>
                <Title>Valor</Title>
                <InputForm name="Valor" type="text" alt="Valor" />
              </ItemInput>
              <ItemInput>
                <Title>Entrada</Title>
                <InputForm name="Entrada" type="date" alt="Entrada" />
              </ItemInput>
            </FormGroup>

            <FormGroup>
              <ItemInput>
                <Title>Conferência</Title>
                <InputForm name="Conferência" type="date" alt="Conferência" />
              </ItemInput>
              <ItemInput>
                <Title>Termo</Title>
                <InputForm name="Termo" type="text" alt="Termo" />
              </ItemInput>
              <ItemInput>
                <Title>Estado</Title>
                <InputForm name="Estado" type="text" alt="Estado" />
              </ItemInput>
            </FormGroup>

            <ItemInput>
              <Title>Observação</Title>
              <InputForm name="observação" type="text" alt="observação" />
            </ItemInput>

            <ItemInput>
              <Title>Nome do Item</Title>
              <InputForm name="Nome_do_Item" type="text" alt="Nome_do_Item" />
            </ItemInput>

            <ItemInput>
              <Title>Localização</Title>
              <InputForm name="localização" type="text" alt="Localização" />
            </ItemInput>
            <ItemInput>
              <Title>Observação</Title>
              <InputForm name="observação2" type="text" alt="observação2" />
            </ItemInput>
          </Form>
          <Content>
            <button className="button" type="button">
              Salvar
            </button>
          </Content>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Patrimony;
