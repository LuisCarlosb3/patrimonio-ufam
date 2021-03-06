import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

interface FormData {
  name: string;
  type: string;
}
type InputProps = JSX.IntrinsicElements['input'] & FormData;

// eslint-disable-next-line
const Input = ({ name, type, ...rest }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <input
      id={fieldName}
      ref={inputRef}
      defaultValue={defaultValue}
      type={type}
      {...rest}
    />
  );
};

export default Input;
