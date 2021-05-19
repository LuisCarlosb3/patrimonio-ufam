import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../components/Icon';
import {
  Container,
  Header,
  Button,
  CardFilter,
  FormFilter,
  Row,
  Dropdown,
  ItemDropdown,
  ButtonDrop,
} from './styles';

const dropItems = ['Bom', 'Ruim', 'Médio', 'Todos'];

const Home: React.FC = () => {
  const [showDrop, setShowDrop] = useState(false);
  const [selectState, setSelectState] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const handleSelectState = (state: string) => {
    setSelectState(state);
  };

  const handleClickOutside = (event: any) => {
    if (ref.current) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDrop(false);
      }
    }
  };

  useEffect(() => {
    handleClickOutside(ref);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <Container>
      <Header>
        <h1>Inventário 2021</h1>

        <Button>
          Acesso
          <Icon icon="arrowRight" color="#fff" stroke={2.4} />
        </Button>
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
            <div ref={ref}>
              <ButtonDrop
                onClick={() => setShowDrop(!showDrop)}
                type="button"
                value={selectState}
              >
                {selectState !== '' ? (
                  selectState
                ) : (
                  <span>Selecione uma opção</span>
                )}
                <Icon icon="arrowDown" color="#000" stroke={2.4} />
              </ButtonDrop>

              <Dropdown activeDropdown={showDrop}>
                {dropItems.map((item) => (
                  <ItemDropdown
                    key={item}
                    onClick={() => {
                      handleSelectState(item);
                      setShowDrop(false);
                    }}
                  >
                    {item}
                  </ItemDropdown>
                ))}
              </Dropdown>
            </div>
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
    </Container>
  );
};

export default Home;
