import * as React from "react";
import { Stream } from "most";
import { async } from "most-subject";

const PLAYER_DIV_ID = "player";

const initializeYouTubeIframeAPI = () => {
  if (
    !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
  ) {
    const ytscript = document.createElement("script");
    ytscript.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(ytscript);
  }
};

// 1. Add onYouTubeIframeAPIReady call back to window
// 2. Add youtube iframe api script to document head. Once loaded,
//  window.onYouTubeIframeAPIReady will be called.
// 3. Can now initiate player iframe
const useYTPlayer = (
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

  const [{ YTPlayerEnded$, onPlayerEnded }] = React.useState(() => {
    const ytPlayer = async<YT.Player>();
    const YTPlayerEnded$ = new Stream(ytPlayer.source);
    const onPlayerEnded = (a: YT.Player) => {
      ytPlayer.next(a);
    };
    return { YTPlayerEnded$, onPlayerEnded };
  });

  React.useEffect(() => {
    if (youTubeIframeReady) {
      const firstVideo = videos.pop();
      new YT.Player(playerDivId, {
        height: "100%",
        width: "100%",
        videoId: firstVideo!!.id,
        playerVars: {
          autoplay: YT.AutoPlay.AutoPlay,
          start: firstVideo!!.startSeconds,
          end: firstVideo!!.endSeconds,
          loop: loop ? YT.Loop.Loop : YT.Loop.SinglePlay,
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
      .filter(() => !loop)
      .tap((player) => {
        const nextVid = videos.pop();
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

export const Player: React.ComponentType<Playlist> = ({
  videos,
  options: { loop },
}) => {
  useYTPlayer(PLAYER_DIV_ID, videos, loop);

  return <div id={PLAYER_DIV_ID} />;
};
