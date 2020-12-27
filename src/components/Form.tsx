import * as React from "react";
import styled from "styled-components";

// TEMP: Remove this once form has been implemented to collect playlist
const placeholderPlaylist = [
  { id: "uvvqjyT0_gA", startSeconds: 98, endSeconds: 113 },
  { id: "QESBcjX-G9g", startSeconds: 105, endSeconds: 115 },
  { id: "yC8SPG2LwSA", startSeconds: 15, endSeconds: 20 },
];

const StartButton = styled.button`
  font-size: 32px;
  padding: 0.35em 1.2em;
  border: 0.1em solid black;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  text-decoration: none;
  background-color: #f98a5e;
  color: black;
  font-weight: 300;
  text-align: center;
  transition: all 0.2s;
  :hover {
    cursor: pointer;
    background-color: #ffffff;
  }
`;

const Container = styled.div`
  padding-top: 100px;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  width: 100%;
`;

// TODO: Implement form to allow starting custom playlist
export const Form: React.ComponentType<{
  setPlaylist: (x: Video[]) => void;
}> = ({ setPlaylist }) => {
  return (
    <Container>
      <StartButton onClick={() => setPlaylist(placeholderPlaylist)}>
        Play
      </StartButton>
    </Container>
  );
};
