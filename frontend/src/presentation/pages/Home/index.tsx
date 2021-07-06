import React, { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { CardFilter, FormFilter, Row, Main, ModalContent } from './styles';
import { ReactComponent as Expand } from '../../../assets/expand.svg';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Separator } from '../../../assets/separator.svg';
import Modal from '../../components/Modal';
import Table, { ItemTable } from '../../components/Table';
import Header from '../../components/Header';
import { Container } from '../../styles/Layout/styles';

const dropItems = ['Bom', 'Ruim', 'Médio', 'Todos'];

const Home: React.FC = () => {
  const [selectState, setSelectState] = useState('');
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const tableHead: ItemTable[] = [
    {
      id: 0,
      title: 'Patrimonio',
    },
    {
      id: 1,
      title: 'Descrição',
    },
    {
      id: 2,
      title: 'Preço',
    },
    {
      id: 3,
      title: 'Data Entrada',
    },
    {
      id: 4,
      title: 'Última Verificação',
    },
  ];

  const bodyItems = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      code: '1423',
      description:
        'Conjunto Escolar composto de 3 mesas, 10 cadeiras e 2 lousas',
      state: 'NOVO',
      entryDate: '2021-07-05',
      lastConferenceDate: '2021-07-05',
      value: 40,
      patrimonyItens: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'Item 1',
          localization: 'Bloco D',
          observation: '',
        },
      ],
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa2',
      code: '16543',
      description:
        'Conjunto Escolar composto de 20 mesas, 40 cadeiras e 20 lousas',
      state: 'NOVO',
      entryDate: '2021-07-05',
      lastConferenceDate: '2021-07-05',
      value: 140,
      patrimonyItens: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'Item 1',
          localization: 'Bloco D',
          observation: '',
        },
      ],
    },
  ];

  return (
    <Container>
      <Header title="Inventário 2021" />

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
        <Table headItems={tableHead} hasActions>
          {bodyItems.map((item) => (
            <tr key={item.id}>
              <td>{item.code}</td>
              <td className="description">{item.description}</td>
              <td>{item.value}</td>
              <td>{item.entryDate}</td>
              <td>{item.lastConferenceDate}</td>

              <td className="actions">
                <Expand onClick={() => setOpenModalCreate(true)} />
              </td>
            </tr>
          ))}
        </Table>
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
