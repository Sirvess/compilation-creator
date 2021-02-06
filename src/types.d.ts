type Video = { id: string; startSeconds?: number; endSeconds?: number };

type Playlist = { videos: Video[]; options: { loop: boolean } };
