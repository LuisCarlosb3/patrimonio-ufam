import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #fff;
    color: #33303E;
    -webkit-font-smoothing: antialiased;
  }

  html {
    font-size: 62.5%;
    @media (max-width: 768px) {
      font-size: 40%;
    }
  }

  body, input, button, select {
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;

    border: 0;
    outline: none;
  }

  body,
  input,
  textarea,
  button {
    font: 500 1.6rem Poppins, sans-serif;
    color:  #808080;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    font-family: Poppins, sans-serif;
    color: #494d4b;
  }

  h1 {
    font-size: 2.4rem;
  }

  h2 {
    font-size: 2rem;
  }

  button {
    cursor: pointer;
  }
`;
