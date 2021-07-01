import React, { useEffect } from 'react';
import { useSpring, config } from 'react-spring';
import { useToast } from '../../../data/hooks/toast';
import { ToastMessage } from '../../../data/protocols/toast';
import { Container, ToastContent } from './styles';

const Toast: React.FC<ToastMessage> = ({ type, title, message, show }) => {
  const { removeToast } = useToast();

  const props = useSpring({
    right: show ? '0%' : '-120%',
    opacity: show ? 1 : 0,
    config: { ...config.stiff },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast();
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message]);

  return (
    <Container>
      <ToastContent type={type} style={props}>
        <div>
          <p>{title}</p>
          <span>{message}</span>
        </div>
        <button type="button">
          {/* eslint-disable-next-line */}
          <div onClick={removeToast}>X</div>
        </button>
      </ToastContent>
    </Container>
  );
};

export default Toast;
