import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";

interface PostIdentifier {
  did: string;
  rkey: string;
}

interface PostData extends PostIdentifier {
  post: string;
  facets?: SocialPskyRichtextFacet.Main[];
}

interface PostRecord extends PostData {
  handle: string;
  nickname?: string;
  indexedAt: number;
  updatedAt?: number;
}

interface UpdateEvent extends PostData {
  updatedAt: number;
}

interface DeleteEvent extends PostIdentifier {}

export type { PostData, PostRecord, UpdateEvent, DeleteEvent };
