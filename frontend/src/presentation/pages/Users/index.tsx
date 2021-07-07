import React, { useState } from 'react';
import { Form } from '@unform/web';
import Header from '../../components/Header';
import Dropdown from '../../components/Dropdown';
import Modal from '../../components/Modal';
import Table, { ItemTable } from '../../components/Table';
import { Container } from '../../styles/Layout/styles';
import { ReactComponent as Expand } from '../../../assets/expand.svg';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Search } from '../../../assets/search.svg';
import {
  ModalContent,
  ItemInput,
  InputForm,
  Title,
  Content,
  Row,
  SearchInput,
} from './styles';

const dropItems = ['Administrador', 'Inventariante'];

const Users: React.FC = () => {
  const [selectState, setSelectState] = useState('');
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
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

  const handleOpenModal = () => {
    setOpenModalCreate(true);
  };

  const handleSearch = () => {
    // getPatrimonyByCode(searchInput);
    console.log('h1');
  };

  return (
    <Container>
      <Header title="Usuários" action={handleOpenModal} />

      <SearchInput>
        {/* eslint-disable-next-line */}
        <div className="search" onClick={handleSearch}>
          <Search />
        </div>
        <input
          type="search"
          value={searchInput}
          placeholder="Buscar por código"
          onChange={(e) => {
            setSearchInput(e.target.value);
            // if (e.target.value === '') {
            //   getPatrimonyList();
            // }
          }}
        />
      </SearchInput>

      <Table headItems={tableHead} hasActions>
        {bodyItems.map((item) => (
          <tr key={item.id}>
            <td>{item.code}</td>
            <td className="description">{item.description}</td>
            <td>{item.value}</td>
            <td>{item.entryDate}</td>
            <td>{item.lastConferenceDate}</td>

            <td className="actions">
              <Expand />
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={openModalCreate} setOpen={setOpenModalCreate}>
        <ModalContent>
          <div className="header">
            <h1 style={{ color: '#14142B' }}>Novo Usuário </h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <Form onSubmit={() => console.log('oia eu aqui!')}>
            <ItemInput>
              <Title>Nome</Title>
              <InputForm name="Nome" type="text" alt="Nome" />
            </ItemInput>
            <ItemInput>
              <Title>Matrícula</Title>
              <InputForm name="Matrícula" type="text" alt="Valor" />
            </ItemInput>
            <ItemInput>
              <Title>Email</Title>
              <InputForm name="Email" type="email" alt="Email" />
            </ItemInput>

            <ItemInput>
              <Title>Senha</Title>
              <InputForm name="Senha" type="password" alt="Senha" />
            </ItemInput>

            <Row>
              <label>Estado</label>
              <Dropdown
                show={false}
                value={selectState}
                items={dropItems}
                onChange={(value) => setSelectState(value)}
              />
            </Row>
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

export default Users;
