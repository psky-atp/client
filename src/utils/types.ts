import type { ComAtprotoRepoStrongRef, SocialPskyRichtextFacet } from "@atcute/client/lexicons";

interface Emoji {
  aliases?: string[];
  emoticons: string[];
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes?: string;
  unified: string;
}

interface PostIdentifier {
  did: string;
  rkey: string;
  cid: string;
}

interface PostData extends PostIdentifier {
  content: string;
  room: string;
  facets?: SocialPskyRichtextFacet.Main[];
  reply?: ComAtprotoRepoStrongRef.Main;
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

interface ServerState {
  sessionCount: number;
}

export type { Emoji, PostData, PostRecord, UpdateEvent, DeleteEvent, ServerState };
