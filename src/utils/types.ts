import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";

interface PostRecord {
  did: string;
  rkey: string;
  post: string;
  facets?: SocialPskyRichtextFacet.Main[];
}

interface CreateEvent extends PostRecord {
  handle: string;
  nickname?: string;
  indexedAt: number;
}

interface UpdateEvent extends PostRecord {
  updatedAt: number;
}

export type { PostRecord, CreateEvent, UpdateEvent };
