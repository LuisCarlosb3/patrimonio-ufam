import React, { createContext, useCallback, useContext, useState } from 'react';

import ToastContainer from '../../presentation/components/Toast';
import { ToastContextData, ToastMessage } from '../protocols/toast';

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messageReceived, setMessage] = useState<ToastMessage>(
    {} as ToastMessage,
  );
  const [show, setShow] = useState(false);

  const addToast = useCallback(
    ({ type, title, message }: ToastMessage) => {
      setShow(true);

      const toast = {
        type,
        title,
        message,
        show,
      };

      setMessage(toast);
    },
    [show],
  );

  const removeToast = useCallback(() => {
    setShow(false);

    setMessage(messageReceived);
  }, [messageReceived]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer
        type={messageReceived.type}
        title={messageReceived.title}
        message={messageReceived.message}
        show={show}
      />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return context;
}

export default ToastProvider;
