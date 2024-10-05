interface PostRecord {
  did: string;
  rkey: string;
  post: string;
  handle: string;
  nickname?: string;
  indexedAt: number;
}

export type { PostRecord };
