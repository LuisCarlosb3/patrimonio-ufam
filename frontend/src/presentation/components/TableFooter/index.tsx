import React, { useState } from 'react';
import { Container } from './styles';

interface IQueryFooterParams {
  page: number;
}

interface ITableFooter {
  data: {
    pageNumber: number;
  };
  onPageChange: (queryFooterParams: IQueryFooterParams) => void;
}

const TableFooter: React.FC<ITableFooter> = ({ data, onPageChange }) => {
  const [page, setPage] = useState(1);

  const handlePagination = (action: string) => {
    if (action === 'increment') {
      setPage(page + 1);
      onPageChange({ page: page + 1 });
      return;
    }

    setPage(page - 1);
    onPageChange({ page: page - 1 });
  };

  return (
    <Container>
      <button
        type="button"
        disabled={page === 1}
        onClick={() => handlePagination('decrement')}
        style={{ marginRight: 4, padding: 10 }}
      >
        -
      </button>

      <p>{page}</p>

      <button
        type="button"
        disabled={data.pageNumber < 10}
        onClick={() => handlePagination('increment')}
        style={{ marginRight: 4, padding: 10 }}
      >
        +
      </button>
    </Container>
  );
};

export default TableFooter;
