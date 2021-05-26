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
  padding-left: 6.25rem;
  background-color: #fff;
  height: 100vh;
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

  @media (max-width: 425px) {
    display: none;
    width: 0rem;
    height: 0rem;
    background-color: #fff;
  }
`;

export const ItemInput = styled.div`
  position: relative;
  :nth-child(1) {
    margin: 0rem 0rem 1rem 0rem;
  }
`;

export const InputForm = styled(Input)`
  z-index: 1;
  width: 26.438rem;
  height: 4rem;
  background: #eff0f6;
  color: #14142b;
  border-radius: 1rem;
  box-sizing: border-box;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.75rem;
  letter-spacing: 0.045rem;
  padding: 1rem 1rem 1rem 4.5rem;

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
  font-size: 0.875rem;
  line-height: 1.43rem;
  align-items: center;
  letter-spacing: 0.05rem;
  color: #5f2eea;
  cursor: pointer;
  margin-bottom: 1.5rem;
  margin-left: 16rem;
  @media (max-width: 425px) {
    margin-left: 0rem;
    text-align: end;
  }
`;

export const Button = styled.button`
  width: 26.625rem;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2.375rem;
  color: #f7f7fc;
  padding: 1.25rem 0rem 1.25rem 0rem;
  border-radius: 0.75rem;
  background: #5f2eea;
  @media (max-width: 425px) {
    width: 55vw;
  }
`;

export const BodyForm = styled.div`
  @media (max-width: 425px) {
    margin: 0rem;
    padding: 0rem;
  }
`;
