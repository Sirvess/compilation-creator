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
  const [playlist, setPlaylist] = React.useState<Playlist | null>(null);

  React.useEffect(() => {
    window.addEventListener("popstate", window.location.reload);
    return () => window.removeEventListener("popstate", window.location.reload);
  }, []);
  return (
    <Root>
      {playlist ? (
        <Player videos={playlist.videos} options={playlist.options} />
      ) : (
        <Form setPlaylist={setPlaylist} />
      )}
      <GlobalStyle />
    </Root>
  );
};

render(<Main />, document.body);
