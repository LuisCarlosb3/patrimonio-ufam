import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;

  margin-top: 2rem;

  p {
    color: #000;
  }

  button {
    border: 0.2rem solid #5f2eea;
    box-sizing: border-box;
    border-radius: 22px;

    width: 3.4rem;
    height: 3.4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #5f2eea;

    font-size: 2rem;

    transition: 0.1s ease-in;

    &:hover {
      background: #5f2eea;
      color: #fff;
    }

    &:disabled {
      background: #efefef;
      color: #dcdcdc;
      border: 0.2rem solid #e8e8e8;
      cursor: initial;

      &:hover {
        background: #efefef;
        color: #dcdcdc;
      }
    }
  }
`;
