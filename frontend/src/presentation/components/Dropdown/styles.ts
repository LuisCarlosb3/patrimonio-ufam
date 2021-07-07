import styled, { css } from 'styled-components';

interface IDropdown {
  activeDropdown?: boolean;
}

interface IButton {
  background?: string;
}

const activeDrop = css`
  visibility: visible;
  opacity: 1;
  transform: translateY(0%);
  z-index: 1;
`;

export const ButtonDrop = styled.button<IButton>`
  padding: 1.05rem 1.8rem;
  width: 100%;
  border-radius: 0.8rem;
  background: ${({ background }) => (!background ? '#82e9ff' : background)};
  cursor: auto;

  text-align: justify;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  color: #000;
  position: relative;
  z-index: 99;

  span {
    font-weight: 400;
    color: #535353;
    margin-left: 0 !important;
  }

  svg {
    margin-left: 1rem;
    cursor: pointer;
  }
`;

export const Container = styled.div<IDropdown>`
  background: #fff;
  border-radius: 0.8rem;
  width: 100%;

  margin-top: -2rem;
  position: absolute;
  top: 74px;
  box-shadow: 0px 4px 10px -1px rgba(210, 210, 210, 0.85);

  visibility: hidden;
  z-index: -1;
  opacity: 0;
  transform: translateY(-2em);
  transition: all 0.3s ease-in-out;

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
  transition: color 0.25s ease-in-out;

  &:hover {
    color: #5f2eea;
  }
`;
