import React from 'react';
import { Container } from './styles';

export interface ItemTable {
  id: number | string;
  title: string;
}

interface Table {
  headItems: ItemTable[];
  hasActions?: boolean;
}

const Table: React.FC<Table> = ({ headItems, hasActions, children }) => {
  return (
    <Container>
      <table>
        <thead>
          <tr>
            {headItems?.map((head) => (
              <th key={head.id}>{head.title}</th>
            ))}
            {hasActions && <th className="actions">Ações</th>}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </Container>
  );
};

export default Table;
