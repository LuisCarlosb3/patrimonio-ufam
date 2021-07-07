import React, { useEffect, useState } from 'react';
// import Dropdown from '../../components/Dropdown';
import { CardFilter, FormFilter, Row, Main, ModalContent } from './styles';
import { ReactComponent as Expand } from '../../../assets/expand.svg';
import { ReactComponent as Close } from '../../../assets/close.svg';
import { ReactComponent as Separator } from '../../../assets/separator.svg';
import Modal from '../../components/Modal';
import Table, { ItemTable } from '../../components/Table';
import Header from '../../components/Header';
import { Container } from '../../styles/Layout/styles';
import { usePatrimony } from '../../../data/hooks/contexts/patrimony';
import {
  // patrimonyStatusEnum,
  RegisterPatrimony,
} from '../../../data/hooks/contexts/patrimony/types';
import { formatCurrency, formatDate } from '../../../data/utils/formats';

const Home: React.FC = () => {
  // const [selectState, setSelectState] = useState('');
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [dataList, setDataList] = useState<RegisterPatrimony[]>([]);
  const [search, setSearch] = useState('');

  const { patrimonyList, getPatrimonyList } = usePatrimony();

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

  useEffect(() => {
    getPatrimonyList();
  }, [getPatrimonyList]);

  useEffect(() => {
    setDataList(patrimonyList);
  }, [patrimonyList]);

  return (
    <Container>
      <Header title="Inventário 2021" />

      <CardFilter>
        <h2>Relação de inventário físico do ICET</h2>

        <FormFilter>
          {/* <Row>
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
              items={patrimonyStatusEnum}
              placeholder="Selecione uma opção"
              onChange={(value) => setSelectState(value)}
            />
          </Row> */}

          <Row>
            <label>Buscar por Patrimônio</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Row>
        </FormFilter>

        <span>
          *Todos os dados são informações públicas extraídas do sistema de
          Patrimônio do ICET
        </span>
      </CardFilter>

      <Main>
        {dataList && dataList.length > 0 && (
          <Table headItems={tableHead} hasActions>
            {dataList
              .filter((li) =>
                li.code.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td className="description">{item.description}</td>
                  <td>{formatCurrency(item.value)}</td>
                  <td>{formatDate(item.entryDate)}</td>
                  <td>{formatDate(item.lastConferenceDate)}</td>
                  <td className="actions">
                    <Expand onClick={() => setOpenModalCreate(true)} />
                  </td>
                </tr>
              ))}
          </Table>
        )}
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
