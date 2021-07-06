import React from 'react';

import { Container, Overlay, Content } from './styles';

export interface IModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<IModal> = ({ children, open, setOpen }) => {
  return (
    <Container open={open}>
      <Overlay onClick={() => setOpen(false)} />
      <Content>{children}</Content>
    </Container>
  );
};

export default Modal;
