import React, { useState, useCallback, useEffect } from 'react';
import { Form } from '@unform/web';
import { patrimonyStatusEnum } from '../../../data/hooks/contexts/patrimony/types';
import { usePatrimony } from '../../../data/hooks/contexts/patrimony';
import Dropdown from '../../components/Dropdown';
import { Container } from '../../styles/Layout/styles';
import {
  ModalContent,
  FormGroup,
  ItemInput,
  InputForm,
  Title,
  Content,
  SearchInput,
} from './styles';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Delete } from '../../../assets/delete.svg';
import { ReactComponent as Edit } from '../../../assets/edit.svg';
import { ReactComponent as Search } from '../../../assets/search.svg';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import Table, { ItemTable } from '../../components/Table';
import {
  formatCurrency,
  formatDate,
  moneyMask,
} from '../../../data/utils/formats';
import TableFooter from '../../components/TableFooter';

interface InserDataItem {
  code: string;
  description: string;
  entryDate: string;
  lastConferenceData: string;
  localization: string;
  name: string;
  observation: string;
  state: string;
  term: string;
  value: string;
}

const tableHead: ItemTable[] = [
  {
    id: 0,
    title: 'Código',
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
    id: 4,
    title: 'Última Verificação',
  },
];

const Patrimony: React.FC = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [selectState, setSelectState] = useState('');
  const [valueCode, setValueCode] = useState('');
  const [valueCurrency, setValueCurrency] = useState(moneyMask('0'));
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({
    pageNumber: 0,
  });

  const {
    registerPatrimony,
    patrimonyList,
    getPatrimonyList,
    getPatrimonyByCode,
    deletePatrimony,
    getPatrimonyListByPage,
  } = usePatrimony();

  const handleOpenModal = () => {
    setOpenModalCreate(true);
  };

  const handleSearch = () => {
    getPatrimonyByCode(searchInput);
  };

  const handleCreateItem = useCallback(
    async (data: InserDataItem, { reset }) => {
      function getMoney(str: string): string {
        const currency = str.replace('R$', '');
        const value = parseFloat(currency.replace(',', '.'));

        return value.toString();
      }

      const newData = {
        code: data.code,
        description: data.description,
        state:
          selectState.toUpperCase() === 'INSERVIVEL'
            ? 'INSERVIVEl'
            : selectState.toUpperCase(),
        entryDate: data.entryDate,
        lastConferenceDate: data.lastConferenceData,
        value: getMoney(data.value),
        patrimonyItens: [
          {
            name: data.name,
            localization: data.localization,
            observation: data.observation,
          },
        ],
      };

      registerPatrimony(newData);
      setOpenModalCreate(false);
      setSelectState('');
      reset();
    },
    [selectState, registerPatrimony],
  );

  const handleDeletPatrimony = (id: string) => {
    deletePatrimony(id);
  };

  const fetchData = useCallback(() => {
    if (patrimonyList) {
      setResults({
        pageNumber: patrimonyList.length,
      });
    }
  }, [patrimonyList]);

  useEffect(() => {
    getPatrimonyList();
  }, [getPatrimonyList]);

  useEffect(() => {
    setResults({ pageNumber: 0 });
  }, [patrimonyList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <Header title="Patrimônio" action={handleOpenModal} />

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
            if (e.target.value === '') {
              getPatrimonyList();
            }
          }}
        />
      </SearchInput>

      {patrimonyList && patrimonyList.length > 0 ? (
        <Table headItems={tableHead} hasActions>
          {patrimonyList.map((item) => (
            <tr key={item.id}>
              <td>{item.code}</td>
              <td className="description">{item.description}</td>
              <td>{formatCurrency(item.value)}</td>
              <td>{formatDate(item.lastConferenceDate)}</td>
              <td className="actions">
                <Delete onClick={() => handleDeletPatrimony(item.id || '')} />
                <Edit onClick={() => setOpenModalCreate(true)} />
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Table headItems={tableHead} hasActions>
          <tr>
            <td style={{ textAlign: 'center' }} colSpan={6}>
              Nenhum patrimônio encontrado...
            </td>
          </tr>
        </Table>
      )}

      <TableFooter
        data={results}
        onPageChange={({ page }) => getPatrimonyListByPage(page)}
      />

      <Modal open={openModalCreate} setOpen={setOpenModalCreate}>
        <ModalContent>
          <div className="header">
            <h1 style={{ color: '#14142B' }}>Cadastrar Item</h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <Form onSubmit={handleCreateItem}>
            <FormGroup>
              <ItemInput>
                <Title>Código</Title>
                <InputForm
                  name="code"
                  type="text"
                  alt="Código"
                  onChange={(e) => setValueCode(e.target.value)}
                />
              </ItemInput>
              <ItemInput>
                <Title>Valor</Title>
                <InputForm
                  name="value"
                  type="text"
                  alt="Valor"
                  value={valueCurrency}
                  onChange={(e) => setValueCurrency(moneyMask(e.target.value))}
                />
              </ItemInput>
              <ItemInput>
                <Title>Entrada</Title>
                <InputForm
                  required
                  name="entryDate"
                  type="date"
                  alt="Entrada"
                />
              </ItemInput>
            </FormGroup>

            <FormGroup>
              <ItemInput>
                <Title>Conferência</Title>
                <InputForm
                  required
                  name="lastConferenceData"
                  type="date"
                  alt="Conferência"
                />
              </ItemInput>
              <ItemInput>
                <Title>Termo</Title>
                <InputForm
                  disabled
                  value={valueCode}
                  name="term"
                  readOnly
                  type="text"
                  alt="Termo"
                />
              </ItemInput>
              <ItemInput>
                <Title>Estado</Title>
                <Dropdown
                  show={false}
                  value={selectState}
                  items={patrimonyStatusEnum}
                  background="#eff0f6"
                  placeholder="Selecione"
                  onChange={(value) => setSelectState(value)}
                />
              </ItemInput>
            </FormGroup>

            <ItemInput>
              <Title>Descrição</Title>
              <InputForm
                required
                name="description"
                type="text"
                alt="observação"
              />
            </ItemInput>

            <ItemInput>
              <Title>Nome do Item</Title>
              <InputForm required name="name" type="text" alt="Nome_do_Item" />
            </ItemInput>

            <ItemInput>
              <Title>Localização</Title>
              <InputForm
                required
                name="localization"
                type="text"
                alt="Localização"
              />
            </ItemInput>
            <ItemInput>
              <Title>Observação</Title>
              <InputForm
                required
                name="observation"
                type="text"
                alt="observação2"
              />
            </ItemInput>
            <Content>
              <button className="button" type="submit">
                Salvar
              </button>
            </Content>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Patrimony;
