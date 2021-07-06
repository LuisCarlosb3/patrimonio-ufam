import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-weight: 400;
    font-size: 3rem;
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: 2.8rem;

    .btn-action {
      background: #2a00a2;
      width: 4.8rem;
      height: 4.8rem;
      border-radius: 10rem;

      color: #fff;
      font-size: 3.4rem;
      font-weight: 400;
      transition: 0.25s all ease-in-out;

      &:hover {
        filter: brightness(85%);
      }
    }
  }

  .user-data {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;

    div {
      display: flex;
      align-items: center;

      h4 {
        font-size: 2.2rem;
        margin-left: 0.8rem;
      }
    }

    button {
      background: none;
      border: 0;
      color: #946200;
      font-weight: 600;
      font-size: 1.8rem;

      cursor: pointer;
    }
  }
`;
