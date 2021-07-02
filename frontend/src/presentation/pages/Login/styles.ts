import styled from 'styled-components';
import Input from '../../components/Input';

export const Head = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  background-color: #f7f7fc;
`;

export const Body = styled.div`
  padding-top: 5.93rem;
  background-color: #fff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 425px) {
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
`;
export const Title = styled.h1`
  padding: 2rem 0rem 3.75rem 0rem;
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 3rem;
  line-height: 3.125rem;
  letter-spacing: 0.063rem;
  color: #2a00a2;
  @media (max-width: 425px) {
    text-align: left;
  }
`;

export const Ilustration = styled.div`
  justify-self: center;
  align-self: center;
  margin-top: 3.4rem;

  @media (max-width: 425px) {
    display: none;
    width: 0rem;
    height: 0rem;
    background-color: #fff;
  }
`;

export const ItemInput = styled.div`
  position: relative;
  width: 100%;
  :nth-child(1) {
    margin: 0rem 0rem 1rem 0rem;
  }
`;

export const InputForm = styled(Input)`
  z-index: 1;
  width: 100%;
  height: 4rem;
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
  padding: 2.8rem 4.5rem;
  margin-bottom: 1.4rem;

  :focus-visible {
    border: 0.125rem solid #2a00a2;
    background: #fcfcfc;
  }
  ::placeholder {
    color: #6e7191;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
  }
  @media (max-width: 425px) {
    width: 55vw;
    font-weight: 4rem;
  }
`;

export const Span = styled.p`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.43rem;
  align-items: center;
  letter-spacing: 0.05rem;
  color: #5f2eea;
  cursor: pointer;
  margin-bottom: 1.5rem;
  float: right;
  @media (max-width: 425px) {
    margin-left: 0rem;
    text-align: end;
  }
`;

export const Button = styled.button`
  width: 100%;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2.375rem;
  color: #f7f7fc;
  padding: 1.8rem;
  border-radius: 0.75rem;
  background: #5f2eea;
  @media (max-width: 425px) {
    width: 55vw;
  }
`;

export const BodyForm = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -5.8rem;

  form {
    width: 100%;
    max-width: 38rem;
  }

  form {
    justify-self: center;
  }
  @media (max-width: 425px) {
    margin: 0rem;
    padding: 0rem;
  }
`;
