import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  gap: 2.8rem;
  padding: 3rem 4rem;
`;

export const Header = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-weight: 400;
    font-size: 3rem;
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

export const Button = styled.button`
  background: #5f2eea;
  border-radius: 11px;

  padding: 0.9rem 4rem;
  color: #fff;
  font-weight: 400;
  font-size: 1.4rem;
  transition: filter 0.2s ease-out;

  &:hover {
    filter: brightness(90%);
  }
`;

export const CardFilter = styled.div`
  padding: 3rem 4rem;

  background: linear-gradient(114.44deg, #624af2 0%, #50ddc3 100%);
  border-radius: 30px;

  color: #fff;

  h2 {
    color: inherit;
    font-weight: 400;
    font-size: 2.6rem;
  }

  span {
    font-weight: 400;
    color: #000;
    margin-left: 4rem;
  }
`;

export const FormFilter = styled.form`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;

  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  label {
    margin-bottom: 0.8rem;
  }

  input {
    padding: 1rem 1.8rem;
    width: 240px;
    border-radius: 0.8rem;
    background: #82e9ff;

    color: #000;
  }

  @media (max-width: 980px) {
    width: 100%;

    input {
      width: 100%;
    }

    button {
      width: 100%;
    }
  }
`;

export const Main = styled.div`
  margin-top: 0.4rem;
`;

export const TableHead = styled.div`
  background: #ffff;
  box-shadow: 0px 4px 10px -1px rgba(186, 186, 186, 0.22);
  text-align: left;

  padding: 2rem 0.2rem;
  border-radius: 1.8rem;
  margin-bottom: 3.2rem;

  display: flex;
  align-items: center;
  justify-content: space-around;

  p {
    color: #000;
    font-weight: 700;
    width: 100%;
  }
`;

export const TableBody = styled.div`
  background: #ffff;
  box-shadow: 0px 4px 10px -1px rgba(186, 186, 186, 0.22);
  text-align: left;

  padding: 2rem 0.2rem;

  display: flex;
  align-items: center;
  justify-content: space-around;

  border-bottom: 1px solid #d9dbe9;

  &:nth-of-type(2) {
    border-top-left-radius: 1.8rem !important;
    border-top-right-radius: 1.8rem;
  }

  &:last-child {
    border: none;
    border-bottom-left-radius: 1.8rem;
    border-bottom-right-radius: 1.8rem;
  }

  p {
    color: #000;
    font-weight: 400;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div {
    cursor: pointer;
  }
`;

export const ModalContent = styled.div`
  background: #fff;
  width: 100%;
  max-width: 48rem;
  padding: 3.4rem;
  border-radius: 2rem;
  position: relative;
  overflow-y: auto;
  max-height: calc(100vh - 2rem);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      color: #0f0f0f;

      font-weight: bold;
      font-size: 3.4rem;
    }

    svg {
      position: absolute;
      top: 2rem;
      right: 2rem;

      cursor: pointer;
    }
  }

  .patrimonio {
    margin-top: 2rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem 3rem;
    flex-wrap: wrap;
    color: #151515;

    h4 {
      font-size: 1.6rem;
      color: #151515;
    }

    p {
      margin-top: 0.8rem;
      font-size: 1.4rem;
    }
  }
`;
