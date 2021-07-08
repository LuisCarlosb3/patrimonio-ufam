import styled from 'styled-components';

export const Container = styled.div`
  textarea {
    display: block;
    resize: vertical;
    box-sizing: border-box;
    margin-top: 3px;
    background: #eff0f6;
    color: #14142b;
    border: none;
    border-radius: 1rem;
    padding: 12px 15px;
    width: 100%;
    transition: border-color 0.2s;

    :focus-visible {
      border: 0.125rem solid #2a00a2;
      background: #fcfcfc;
    }

    &[disabled] {
      cursor: not-allowed;
      background: #201b2d;
    }
  }
`;
