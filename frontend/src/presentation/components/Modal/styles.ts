import styled from 'styled-components';

interface IModal {
  open: boolean;
}

export const Content = styled.div`
  transition: margin-top 0.25s;
  position: relative;
  padding: 20px;
`;

export const Container = styled.div<IModal>`
  width: 100vw;
  height: 100vh;

  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 1;

  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.open ? '1' : '0')};

  transition: visibility 0.35s, opacity 0.35s;

  ${Content} {
    margin-top: ${(props) => (props.open ? '0px' : '-100px')};
  }
`;

export const Overlay = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
`;
