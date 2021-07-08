import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { Container } from './styles';

interface FormData {
  name: string;
  label: string;
  multiline: boolean;
}

type InputProps = JSX.IntrinsicElements['textarea'] & FormData;

// eslint-disable-next-line
const TextArea = ({ label, name, multiline, ...rest }: InputProps) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref) => {
        return ref.value;
      },
    });
  }, [fieldName, registerField]);

  const props = {
    ...rest,
    ref: inputRef,
    id: fieldName,
    'aria-label': label,
    defaultValue,
  };

  return (
    <Container>
      <textarea {...props} />
    </Container>
  );
};

export default TextArea;
