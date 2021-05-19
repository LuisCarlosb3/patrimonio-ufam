import styled, { css } from 'styled-components';
import { Link as LinkRouter } from 'react-router-dom';

interface Links {
  active: number;
}

export const Container = styled.div`
  width: 26.5rem;
  height: 100vh;
  padding: 3rem 0rem;

  display: flex;
  flex-direction: column;
`;

export const Logo = styled.div`
  align-self: center;
  margin-bottom: 6.5rem;

  img {
    width: 100%;
    max-width: 120px;
    cursor: pointer;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: flex-end;
    margin-bottom: 2rem;

    text-decoration: none;
    font-size: 1.4rem;
    position: relative;

    padding-left: 2rem;

    svg {
      margin-right: 1.4rem;
    }
  }
`;

const activeSide = css`
  &:after {
    content: '';
    width: 4px;
    height: 32px;
    background: #5f2eea;

    position: absolute;
    right: -2px;
  }
`;

export const Link = styled(LinkRouter)<Links>`
  color: ${({ active }) => (active ? '#000' : '#A0A3BD')};
  font-weight: ${({ active }) => (active ? 500 : 400)};

  ${({ active }) => active && activeSide};
`;
