import styled, { css } from 'styled-components';
import { Link as LinkRouter } from 'react-router-dom';

interface Links {
  activeRoute: boolean;
}

export const Container = styled.div`
  width: 26.5rem;
  height: 100vh;
  padding: 3rem 0rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    text-decoration: none;
    font-size: 1.4rem;
    position: relative;

    padding-left: 2rem;
  }

  svg {
    margin-right: 1.4rem;
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
  color: ${({ activeRoute }) => (activeRoute ? '#000' : '#A0A3BD')};
  font-weight: ${({ activeRoute }) => (activeRoute ? 500 : 400)};

  ${({ activeRoute }) => activeRoute && activeSide};
`;
