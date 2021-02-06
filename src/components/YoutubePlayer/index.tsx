import * as React from "react";

const PLAYER_DIV_ID = "player";

import { useYTPlayer } from "./hooks";

export const Player: React.ComponentType<Playlist> = ({
  videos,
  options: { loop },
}) => {
  useYTPlayer(PLAYER_DIV_ID, videos, loop);

  return <div id={PLAYER_DIV_ID} />;
};
