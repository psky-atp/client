import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";

interface PostRecord {
  did: string;
  rkey: string;
  post: string;
  facets?: SocialPskyRichtextFacet.Main[];
  handle: string;
  nickname?: string;
  indexedAt: number;
}

export type { PostRecord };
