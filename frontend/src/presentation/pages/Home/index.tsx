import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { useAuth } from '../../../data/hooks/auth';
import {
  Container,
  Header,
  CardFilter,
  FormFilter,
  Row,
  Main,
  TableHead,
  TableBody,
  ModalContent,
} from './styles';
import { ReactComponent as ProfileIcon } from '../../../assets/Profile.svg';
import { ReactComponent as Expand } from '../../../assets/expand.svg';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Separator } from '../../../assets/separator.svg';
import Modal from '../../components/Modal';

const dropItems = ['Bom', 'Ruim', 'Médio', 'Todos'];

const Home: React.FC = () => {
  const [selectState, setSelectState] = useState('');
  const { signOut } = useAuth();
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <Container>
      <Header>
        <h1>Inventário 2021</h1>

        <div className="user-data">
          <div>
            <ProfileIcon />
            <h4>Junior Albuquerque</h4>
          </div>

          <button type="button" onClick={signOut}>
            Desconectar
          </button>
        </div>
      </Header>

      <CardFilter>
        <h2>Relação de inventário físico do ICET</h2>

        <FormFilter>
          <Row>
            <label>Data Inicial</label>
            <input type="date" />
          </Row>

          <Row>
            <label>Data Final</label>
            <input type="date" />
          </Row>

          <Row>
            <label>Estado</label>
            <Dropdown
              show={false}
              value={selectState}
              items={dropItems}
              onChange={(value) => setSelectState(value)}
            />
          </Row>

          <Row>
            <label>Patrimônio</label>
            <input type="text" />
          </Row>
        </FormFilter>

        <span>
          *Todos os dados são informações públicas extraídas do sistema de
          Patrimônio do ICET
        </span>
      </CardFilter>

      <Main>
        <TableHead>
          <p style={{ maxWidth: '40px' }}>Patrimonio</p>
          <p style={{ maxWidth: '400px' }}>Descrição</p>
          <p style={{ maxWidth: '140px' }}>Preço</p>
          <p style={{ maxWidth: '140px' }}>Data Entrada</p>
          <p style={{ maxWidth: '180px' }}>Última Verificação</p>
          <div
            style={{ color: 'transparent', maxWidth: '40px', marginRight: 20 }}
          >
            Actions
          </div>
        </TableHead>

        <TableBody className="table-body">
          <p style={{ maxWidth: '40px' }}>12</p>
          <p style={{ maxWidth: '400px' }}>
            Conjunto Escolar composto de 2 mesas, 3 cadeiras
          </p>
          <p style={{ maxWidth: '140px' }}>R$ 450,00</p>
          <p style={{ maxWidth: '140px' }}>05/05/2021</p>
          <p style={{ maxWidth: '180px' }}>05/05/2021</p>
          <div style={{ maxWidth: '40px', marginRight: 20 }}>
            <Expand onClick={() => setOpenModalCreate(true)} />
          </div>
        </TableBody>
      </Main>

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

export default Home;
