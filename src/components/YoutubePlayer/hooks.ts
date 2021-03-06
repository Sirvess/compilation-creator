import * as React from "react";
import { async } from "most-subject";
import { Stream } from "most";

import { initializeYouTubeIframeAPI } from "./utils";

const usePlaylist = (
  videos: Video[],
  loop: boolean = false
): { getNextVideo: () => Video | null; getFirstVideo: () => Video | null } => {
  const [{ getFirstVideo, getNextVideo }] = React.useState(() => {
    let nextIndex = 0; // May this never escape this hook
    const getNextVideo = () => {
      if (!loop && nextIndex === videos.length - 1) {
        return null;
      } else if (loop && nextIndex === videos.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = nextIndex + 1;
      }
      return videos[nextIndex];
    };

    return { getNextVideo, getFirstVideo: () => videos[0] };
  });

  return { getNextVideo, getFirstVideo };
};

const initYTAutoplaySubject = () => {
  const ytPlayer = async<YT.Player>();
  const YTPlayerEnded$ = new Stream(ytPlayer.source);
  const onPlayerEnded = (a: YT.Player) => {
    ytPlayer.next(a);
  };
  return { YTPlayerEnded$, onPlayerEnded };
};

// 1. Add onYouTubeIframeAPIReady call back to window
// 2. Add youtube iframe api script to document head. Once loaded,
//  window.onYouTubeIframeAPIReady will be called.
// 3. Can now initiate player iframe
export const useYTPlayer = (
  playerDivId: string,
  videos: Video[],
  loop: boolean = false
) => {
  const [youTubeIframeReady, setYouTubeIframeReady] = React.useState(false);
  React.useEffect(() => {
    // window.onYouTubeIframeAPIReady will be called by YouTube Iframe API once loaded
    (window as any).onYouTubeIframeAPIReady = () => setYouTubeIframeReady(true);
    initializeYouTubeIframeAPI();
  }, [setYouTubeIframeReady]);

  const [{ YTPlayerEnded$, onPlayerEnded }] = React.useState(
    initYTAutoplaySubject
  );

  const { getFirstVideo, getNextVideo } = usePlaylist(videos, loop);

  // This effect will instantiate the player and target the DOM element with `playerDivId`
  React.useEffect(() => {
    if (youTubeIframeReady) {
      const firstVideo = getFirstVideo();
      new YT.Player(playerDivId, {
        height: "100%",
        width: "100%",
        videoId: firstVideo!!.id,
        playerVars: {
          rel: YT.RelatedVideos.Hide,
          autoplay: YT.AutoPlay.AutoPlay,
          start: firstVideo!!.startSeconds,
          end: firstVideo!!.endSeconds,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            return event;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              onPlayerEnded(event.target);
            } else if (event.data === YT.PlayerState.CUED) {
              event.target.playVideo();
            }
            // If we don't return event here player will stall
            return event;
          },
        },
      });
    }
  }, [youTubeIframeReady]);

  // This effect plays the next video once once video has ended
  React.useEffect(() => {
    // HACK: Existing player sends multiple ended-events
    // Needs some investigating
    const sub = YTPlayerEnded$.throttle(2000)
      .tap((player) => {
        const nextVid = getNextVideo();
        if (nextVid) {
          player.cueVideoById({
            videoId: nextVid.id,
            startSeconds: nextVid.startSeconds,
            endSeconds: nextVid.endSeconds,
          });
        } else {
          // TODO: Currently not possible to do clean teardown using API?
          // For now just reloading page once playback has ended
          player.destroy();
          window.location.reload();
        }
      })
      .subscribe({} as any);
    return () => sub.unsubscribe();
  }, [YTPlayerEnded$]);
};
