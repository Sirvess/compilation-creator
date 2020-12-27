import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { render } from "react-dom";

import { Player, Form } from "./components";

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const GlobalStyle = createGlobalStyle`
  body {
      margin:0;
      padding:0;
      * {
          box-sizing: border-box;
      }
  }
`;

export const Main = () => {
  const [playlist, setPlaylist] = React.useState<Video[] | null>(null);
  return (
    <Root>
      {playlist ? (
        <Player videos={playlist} />
      ) : (
        <Form setPlaylist={setPlaylist} />
      )}
      <GlobalStyle />
    </Root>
  );
};

render(<Main />, document.body);
