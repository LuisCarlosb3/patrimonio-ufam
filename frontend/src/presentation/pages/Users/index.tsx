import React from 'react';
import Header from '../../components/Header';
import Table, { ItemTable } from '../../components/Table';
import { Container } from '../../styles/Layout/styles';
import { ReactComponent as Expand } from '../../../assets/expand.svg';

const Users: React.FC = () => {
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
      <Header title="Usuários" />

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
    </Container>
  );
};

export default Users;
