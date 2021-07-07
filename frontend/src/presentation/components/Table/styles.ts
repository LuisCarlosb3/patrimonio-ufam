import styled from 'styled-components';

export const Container = styled.div`
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    box-shadow: 0px 4px 10px -1px rgba(186, 186, 186, 0.22);
    border-radius: 10px;

    td,
    th {
      padding: 2rem;
      text-align: left;
    }

    td {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .actions {
      text-align: center;
      max-width: 10rem;

      svg {
        cursor: pointer;

        & + svg {
          margin-left: 1.8rem;
        }
      }
    }

    thead {
      background: #ffff;
      text-align: left;

      tr {
        color: #000;
        font-weight: 700;
        width: 100%;
        border-bottom: 1px solid #d9dbe9;

        th:first-child {
          border-top-left-radius: 2rem;
        }

        th:last-child {
          border-top-right-radius: 2rem;
        }
      }
    }

    tbody {
      background: #ffff;
      text-align: left;

      .description {
        max-width: 40rem;
      }

      tr {
        color: #000;
        font-weight: 400;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid #d9dbe9;

        &:last-child {
          border: none;

          td:first-child {
            border-bottom-left-radius: 2rem;
          }

          td:last-child {
            border-bottom-right-radius: 2rem;
          }
        }
      }
    }
  }
`;
