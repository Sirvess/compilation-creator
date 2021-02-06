export const initializeYouTubeIframeAPI = () => {
  if (
    !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
  ) {
    const ytscript = document.createElement("script");
    ytscript.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(ytscript);
  }
};
