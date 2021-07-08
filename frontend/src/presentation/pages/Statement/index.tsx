import React, { useState } from 'react';
import { Form } from '@unform/web';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Separator } from '../../../assets/separator.svg';
import Modal from '../../components/Modal';
import { Container } from '../../styles/Layout/styles';
import Header from '../../components/Header';
import {
  FormContent,
  ItemInput,
  InputForm,
  Title,
  Content,
  FormGroup,
  ModalContent,
} from './styles';

const Statement: React.FC = () => {
  const [openModalCreate, setOpenModalCreate] = useState(true);

  return (
    <Container>
      <Header title="Retirar Item" />

      <FormContent>
        {/* <div className="header">
          <h1 style={{ color: '#14142B' }}>Novo Usuário </h1>
        </div> */}

        <Form onSubmit={() => console.log('logica do form ')}>
          <ItemInput>
            <Title>Nome do Reponsável</Title>
            <InputForm required name="name" type="text" alt="Nome" />
          </ItemInput>
          <FormGroup>
            <ItemInput>
              <Title>Data</Title>
              <InputForm required name="data" type="Date" alt="data" />
            </ItemInput>
            <ItemInput>
              <Title>Siape</Title>
              <InputForm required name="siape" type="text" alt="Siape" />
            </ItemInput>
          </FormGroup>

          <ItemInput>
            <Title>Código do Patrimônio</Title>
            <InputForm required name="Item" type="text" alt="Item" />
          </ItemInput>
          <Content>
            <button className="button" type="submit">
              Verificar
            </button>
          </Content>
        </Form>
      </FormContent>

      <Modal open={openModalCreate} setOpen={setOpenModalCreate}>
        <ModalContent>
          <div className="header">
            <h1>Patrimônio</h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <div className="patrimonio">
            <div className="row">
              <h4>Código</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Valor</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Estado</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Entrada</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Última Verificação</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Conferência</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Termo</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Descrição</h4>
              <p style={{ textAlign: 'justify' }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>

          <Separator />

          <div className="header">
            <h1>Itens</h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <div className="patrimonio" style={{ justifyContent: 'flex-start' }}>
            <div className="row">
              <h4>Nome</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Localização</h4>
              <p>1234567</p>
            </div>

            <div className="row">
              <h4>Observação</h4>
              <p style={{ textAlign: 'justify' }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Statement;
