import styled from 'styled-components';
import Input from '../../components/Input';

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

export const ModalContent = styled.div`
  background: #fff;
  width: auto;
  max-width: calc(100vh - 2rem);
  max-height: calc(100vh - 2rem);
  padding: 3.4rem;
  border-radius: 2rem;
  position: relative;
  overflow-y: auto;

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

export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  max-width: 70rem;
`;

export const ItemInput = styled.div`
  width: 100%;
`;

export const InputForm = styled(Input)`
  z-index: 1;
  width: 100%;
  height: 4.6rem;
  background: #eff0f6;
  color: #14142b;
  border-radius: 1rem;
  box-sizing: border-box;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 1.6rem;
  line-height: 1.75rem;
  letter-spacing: 0.045rem;
  padding: 1.5rem 1.5rem;
  margin-bottom: 1.4rem;

  :focus-visible {
    border: 0.125rem solid #2a00a2;
    background: #fcfcfc;
  }
  ::placeholder {
    color: #a0a3bd;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 1.5rem;
  }
  @media (max-width: 425px) {
    width: 55vw;
    font-weight: 4rem;
  }
`;

export const Title = styled.p`
  font-family: Poppins;
  font-style: normal;
  /* font-weight: bold; */
  font-size: 1.5rem;
  line-height: 3.125rem;
  letter-spacing: 0.063rem;
  color: #000000;
  @media (max-width: 425px) {
    text-align: left;
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;

  .button {
    width: 15rem;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 28px;
    background-color: #5f2eea;
    border-radius: 1.2rem;
    text-align: center;
    letter-spacing: 0.75px;
    color: #f7f7fc;
    padding: 1.5rem;
  }
`;

export const SearchInput = styled.div`
  margin: 2rem auto;

  display: flex;
  align-items: center;

  .search {
    width: 6.4rem;
    height: 6.4rem;
    background: #2a00a2;
    border-radius: 20px 0px 0px 20px;

    position: absolute;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    transition: filter 0.25s ease-in;

    &:hover {
      filter: brightness(80%);
    }
  }

  input {
    width: 34rem;
    height: 6rem;

    background: #fcfcfc;
    border: 0.125rem solid #ccc;
    border-radius: 16px;

    padding: 1rem 2rem 1rem 6.8rem;

    :focus-visible {
      border: 0.15rem solid #2a00a2;
      background: #fcfcfc;
    }
  }
`;
