import styled, { css } from 'styled-components';

interface IDropdown {
  activeDropdown?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2.8rem;
`;

export const Header = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-weight: 400;
    font-size: 3rem;
  }
`;

export const Button = styled.button`
  background: #5f2eea;
  border-radius: 11px;

  padding: 0.9rem 4rem;
  color: #fff;
  font-weight: 400;
  font-size: 1.4rem;
  transition: filter 0.2s ease-out;

  &:hover {
    filter: brightness(90%);
  }
`;

export const CardFilter = styled.div`
  padding: 3rem 4rem;

  background: linear-gradient(114.44deg, #624af2 0%, #50ddc3 100%);
  border-radius: 30px;

  color: #fff;

  h2 {
    color: inherit;
    font-weight: 400;
    font-size: 2.6rem;
  }

  span {
    font-weight: 400;
    color: #000;
    margin-left: 4rem;
  }
`;

export const FormFilter = styled.form`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;

  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  label {
    margin-bottom: 0.8rem;
  }

  input {
    padding: 1rem 1.8rem;
    width: 240px;
    border-radius: 0.8rem;
    background: #82e9ff;

    color: #000;
  }

  @media (max-width: 980px) {
    width: 100%;

    input {
      width: 100%;
    }

    button {
      width: 100%;
    }
  }
`;

export const ButtonDrop = styled.button`
  padding: 1rem 1.8rem;
  width: 240px;
  border-radius: 0.8rem;

  background: #82e9ff;
  cursor: auto;

  text-align: justify;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  color: #000;
  position: relative;
  z-index: 999;

  span {
    font-weight: 400;
    color: #535353;
    margin-left: 0;
  }

  svg {
    cursor: pointer;
  }
`;

const activeDrop = css`
  visibility: visible;
  opacity: 1;
  transform: translateY(0%);
  z-index: 1;
  transition-delay: 0s, 0s, 0.3s;
`;

export const Dropdown = styled.div<IDropdown>`
  background: #fff;
  border-radius: 0.8rem;
  width: 100%;

  margin-top: 1rem;
  position: absolute;
  top: 74px;
  box-shadow: 0px 4px 10px -1px rgba(210, 210, 210, 0.25);

  visibility: hidden;
  z-index: -1;
  opacity: 0;
  transform: translateY(-2em);
  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;

  transition: 0.35s;
  ${({ activeDropdown }) => activeDropdown && activeDrop}
`;

export const ItemDropdown = styled.div`
  color: #000;
  border-bottom: 1px solid #eff0f6;
  padding: 1.2rem 1.8rem;

  &:last-child {
    border-bottom: 0px;
  }

  cursor: pointer;

  &:hover {
    transition: 0.25s;
    color: #5f2eea;
  }
`;
