import React, { useState, useCallback, useEffect } from 'react';
import { Form } from '@unform/web';
import { useAuth } from '../../../data/hooks/auth';
import {
  PatrimonyItens,
  patrimonyStatusEnum,
  RegisterPatrimony,
} from '../../../data/hooks/contexts/patrimony/types';
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
import { ReactComponent as DeleteItem } from '../../../assets/deleteItem.svg';
import { ReactComponent as Edit } from '../../../assets/edit.svg';
import { ReactComponent as Search } from '../../../assets/search.svg';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import Table, { ItemTable } from '../../components/Table';
import {
  autoCapitalize,
  FormataStringData,
  formatCurrency,
  formatDate,
  formatDateInput,
  moneyMask,
} from '../../../data/utils/formats';
import TableFooter from '../../components/TableFooter';
import TextArea from '../../components/TextArea';

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
    id: 3,
    title: 'Estado',
  },
  {
    id: 4,
    title: 'Última Verificação',
  },
];

const Patrimony: React.FC = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [selectState, setSelectState] = useState('');
  const [valueCurrency, setValueCurrency] = useState(moneyMask(''));
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({
    pageNumber: 0,
  });
  const [edit, setEdit] = useState(false);

  const [itens, setItens] = useState<PatrimonyItens[]>([]);
  // eslint-disable-next-line
  const [patrimonyItemSelect, setPatrimonyItemSelect] = useState<
    RegisterPatrimony
  >({
    code: 'null',
    description: 'null',
    entryDate: '2020-10-10',
    lastConferenceDate: '2020-10-10',
    patrimonyItens: [],
    state: 'null',
    value: 'null',
    id: 'null',
  });
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const { user } = useAuth();

  const {
    registerPatrimony,
    patrimonyList,
    getPatrimonyList,
    getPatrimonyByCode,
    deletePatrimony,
    getPatrimonyListByPage,
    patrimonyItem,
    updatePatrimony,
  } = usePatrimony();

  const handleOpenModal = () => {
    setItens([]);
    setEdit(false);
    setOpenModalCreate(true);
    setPatrimonyItemSelect({} as RegisterPatrimony);
  };

  const handleSearch = () => {
    if (searchInput !== '') {
      getPatrimonyByCode(searchInput);
    }
  };

  const handleCreateItem = useCallback(
    async (data: InserDataItem, { reset }) => {
      function getMoney(str: string): string {
        const currency = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
        const parts = currency.exec(str) || [];

        const value = parseFloat(
          // eslint-disable-next-line
          parts[1].replace(/\D/, '') + '.' + (parts[2] ? parts[2] : '00'),
        ).toFixed(2);

        return value;
      }

      const patItens = [...itens];

      if (data.name !== undefined) {
        patItens.splice(0, 0, {
          name: data.name,
          localization: data.localization,
          observation: data.observation,
        });
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
        patrimonyItens: patItens,
      };

      if (edit && patrimonyItemSelect) {
        const dataUpdate = {
          id: patrimonyItemSelect.id,
          code: data.code,
          description: data.description,
          state:
            selectState.toUpperCase() === 'INSERVIVEL'
              ? 'INSERVIVEl'
              : selectState.toUpperCase(),
          entryDate: data.entryDate,
          lastConferenceDate: data.lastConferenceData,
          value: getMoney(data.value),
          patrimonyItens: patItens,
          deletedItens: deleteItems,
        };

        updatePatrimony(dataUpdate);
      } else {
        registerPatrimony(newData);
      }
      setOpenModalCreate(false);
      setSelectState('');
      reset();
    },
    [
      selectState,
      registerPatrimony,
      itens,
      edit,
      deleteItems,
      patrimonyItemSelect,
      updatePatrimony,
    ],
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

  const handleAddItem = () => {
    const oldData = [...itens];
    const newData = {
      name: '',
      localization: '',
      observation: '',
    };
    oldData.push(newData);
    setItens(oldData);
  };

  const removeItem = (index: number, item: PatrimonyItens) => {
    const oldDataDelete = [...deleteItems];
    if (item.id) {
      oldDataDelete.push(item.id);
    }

    const oldData = [...itens];
    oldData.splice(index, 1);
    setItens(oldData);
    setDeleteItems(oldDataDelete);
  };

  const handleGetPatrimony = useCallback(
    (item: RegisterPatrimony) => {
      getPatrimonyByCode(item.code, true);
      setEdit(true);
      setOpenModalCreate(true);
      setDeleteItems([]);
    },
    [getPatrimonyByCode],
  );

  useEffect(() => {
    if (Object.keys(patrimonyItem).length > 0 && edit) {
      setPatrimonyItemSelect(patrimonyItem);
      setValueCurrency(formatCurrency(patrimonyItem.value));
      setSelectState(
        patrimonyStatusEnum.filter((item) =>
          item.toLowerCase().includes(patrimonyItem.state.toLowerCase()),
        )[0],
      );
      setItens(patrimonyItem.patrimonyItens);
    } else {
      setValueCurrency(moneyMask('0'));
      setPatrimonyItemSelect({} as RegisterPatrimony);
      setSelectState('');
    }
  }, [patrimonyItem, edit]);

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
        <button type="button" className="search" onClick={handleSearch}>
          <Search />
        </button>
        <input
          type="search"
          value={searchInput}
          required
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
        <Table headItems={tableHead} hasActions={user?.permission === 2}>
          {patrimonyList.map((item) => (
            <tr key={item.id}>
              <td>{item.code}</td>
              <td className="description">{item.description}</td>
              <td>{formatCurrency(item.value)}</td>
              <td>{autoCapitalize(item.state)}</td>
              <td>{formatDate(item.lastConferenceDate)}</td>
              {user?.permission === 2 && (
                <td className="actions">
                  <Delete onClick={() => handleDeletPatrimony(item.id || '')} />
                  <Edit onClick={() => handleGetPatrimony(item)} />
                </td>
              )}
            </tr>
          ))}
        </Table>
      ) : (
        <Table headItems={tableHead} hasActions={user?.permission === 2}>
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
            <h1 style={{ color: '#14142B' }}>
              {!edit ? 'Cadastrar Item' : 'Editar'}
            </h1>
            <Close onClick={() => setOpenModalCreate(!openModalCreate)} />
          </div>

          <Form onSubmit={handleCreateItem}>
            <FormGroup>
              <ItemInput>
                <Title>Código</Title>
                <InputForm
                  name="code"
                  type="text"
                  required
                  value={patrimonyItemSelect.code || ''}
                  alt="Código"
                  onChange={(e) =>
                    setPatrimonyItemSelect((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }))
                  }
                />
              </ItemInput>
              <ItemInput>
                <Title>Valor</Title>
                <InputForm
                  name="value"
                  type="text"
                  required
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
                  value={
                    patrimonyItemSelect.entryDate !== undefined
                      ? FormataStringData(
                          formatDate(patrimonyItemSelect?.entryDate) || '',
                        )
                      : ''
                  }
                  // eslint-disable-next-line
                  onChange={(e) =>
                    setPatrimonyItemSelect((prev) => ({
                      ...prev,
                      entryDate: FormataStringData(
                        formatDateInput(e.target.value) || '',
                      ),
                    }))
                  }
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
                  value={
                    patrimonyItemSelect.lastConferenceDate !== undefined
                      ? FormataStringData(
                          formatDate(patrimonyItemSelect?.lastConferenceDate) ||
                            '',
                        )
                      : ''
                  }
                  // eslint-disable-next-line
                  onChange={(e) =>
                    setPatrimonyItemSelect((prev) => ({
                      ...prev,
                      lastConferenceDate: FormataStringData(
                        formatDateInput(e.target.value) || '',
                      ),
                    }))
                  }
                  alt="Conferência"
                />
              </ItemInput>
              <ItemInput>
                <Title>Termo</Title>
                <InputForm
                  disabled
                  value={patrimonyItemSelect.code || ''}
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
              <TextArea
                value={patrimonyItemSelect.description || ''}
                name="description"
                label="Description"
                multiline
                onChange={(e) =>
                  setPatrimonyItemSelect((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </ItemInput>
            <hr style={{ marginTop: 8, borderTop: '#E8E8E8' }} />
            <p style={{ marginBottom: 8, marginTop: 4 }}>Itens do Patrimônio</p>
            {!edit && (
              <FormGroup>
                <ItemInput>
                  <Title>Nome do Item</Title>
                  <InputForm
                    required
                    name="name"
                    type="text"
                    alt="Nome_do_Item"
                  />
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
              </FormGroup>
            )}

            {itens.map((item, index) => (
              // eslint-disable-next-line
              <FormGroup key={index}>
                <ItemInput>
                  <Title>Nome do Item</Title>
                  <InputForm
                    required
                    name={`${index} name`}
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const oldData = [...itens];
                      oldData[index].name = e.target.value;
                      setItens(oldData);
                    }}
                    alt="Nome_do_Item"
                  />
                </ItemInput>

                <ItemInput>
                  <Title>Localização</Title>
                  <InputForm
                    required
                    name={`${index} local`}
                    value={item.localization}
                    onChange={(e) => {
                      const oldData = [...itens];
                      oldData[index].localization = e.target.value;
                      setItens(oldData);
                    }}
                    type="text"
                    alt="Localização"
                  />
                </ItemInput>
                <ItemInput>
                  <Title>Observação</Title>
                  <InputForm
                    required
                    name={`${index} obs`}
                    type="text"
                    value={item.observation}
                    onChange={(e) => {
                      const oldData = [...itens];
                      oldData[index].observation = e.target.value;
                      setItens(oldData);
                    }}
                    alt="observação2"
                  />
                </ItemInput>
                <button
                  type="button"
                  className="remove"
                  onClick={() => removeItem(index, item)}
                >
                  <DeleteItem />
                </button>
              </FormGroup>
            ))}
            <button type="button" className="add-item" onClick={handleAddItem}>
              + Adicionar Item
            </button>
            <Content>
              <button className="button" type="submit">
                {!edit ? 'Cadastrar' : 'Salvar Alterações'}
              </button>
            </Content>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Patrimony;
