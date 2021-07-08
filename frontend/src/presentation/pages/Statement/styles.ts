import styled from 'styled-components';
import Input from '../../components/Input';

export const FormContent = styled.div`
  background: #fff;
  width: auto;
  align-self: center;
  justify-self: center;
  max-width: calc(100vh - 2rem);
  max-height: calc(100vh - 2rem);
  padding: 3.4rem;
  border-radius: 2rem;
  position: relative;
  overflow-y: auto;
  margin-top: 3.8rem;

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

export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  max-width: 84rem;

  .remove {
    height: 4.5rem;
    margin-top: 3rem;
    padding: 0 1.4rem;
    border-radius: 1rem;

    background: #eb0055;
    font-size: 0;
    transition: 0.25s ease-in-out;

    svg {
      width: 2rem;
      height: 2rem;
    }

    &:hover {
      filter: brightness(80%);
    }
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
    min-width: 18rem;
    width: auto;
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
