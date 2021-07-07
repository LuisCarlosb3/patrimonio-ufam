import React, { useEffect, useRef, useState } from 'react';

import { Container, ButtonDrop, ItemDropdown } from './styles';
import Icon from '../Icon';

interface IDropdown {
  show?: boolean;
  items: string[];
  value: string;
  background?: string;
  placeholder?: string;
  onChange(state: string): void;
}

const Dropdown: React.FC<IDropdown> = ({
  show,
  items,
  value,
  onChange,
  placeholder,
  background,
}) => {
  const [showDrop, setShowDrop] = useState(show || false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelectState = (state: string) => {
    onChange(state);
    setShowDrop(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDrop(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <ButtonDrop
        onClick={() => setShowDrop(!showDrop)}
        type="button"
        value={value}
        background={background}
      >
        {value !== '' ? (
          value
        ) : (
          // eslint-disable-next-line
          <span>{placeholder ? placeholder : 'Selecione uma opção'}</span>
        )}
        <Icon icon="arrowDown" color="#000" stroke={2.4} />
      </ButtonDrop>

      <Container activeDropdown={showDrop}>
        {items.map((item) => (
          <ItemDropdown key={item} onClick={() => handleSelectState(item)}>
            {item}
          </ItemDropdown>
        ))}
      </Container>
    </div>
  );
};

export default Dropdown;
