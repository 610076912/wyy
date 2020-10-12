export type Banner = {
  imageUrl: string,
  targetId: number,
  url: string
};

export type HotTag = {
  id: number,
  name: string,
  position: number
};

export type Singer = {
  id: number,
  name: string,
  picUrl: string,
  albumSize: number
};

export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number, name: string, picUrl: string };
  dt: number;
};

export type SongSheet = {
  id: number;
  userId: number;
  name: string;
  picUrl: string;
  coverImgUrl: string;
  playCount: number;
  tags: string[];
  createTime: number;
  creator: { nickname: string; avatarUrl: string };
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  subscribed: boolean;
  tracks: Song[];
};

export type SongUrl = {
  id: number;
  url: string;
};

export type Lyric = {
  lyric: string;
  tlyric: string;
};

// 歌单列表

export type SheetList = {
  playlists: SongSheet;
  total: number;
}
