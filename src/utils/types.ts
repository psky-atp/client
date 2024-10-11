import {
  ComAtprotoRepoStrongRef,
  SocialPskyRichtextFacet,
} from "@atcute/client/lexicons";

interface PostIdentifier {
  did: string;
  rkey: string;
  cid: string;
}

interface PostData extends PostIdentifier {
  post: string;
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

export type { PostData, PostRecord, UpdateEvent, DeleteEvent, ServerState };
