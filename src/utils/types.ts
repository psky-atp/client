import { Facet } from "./rich-text/defs.js";

interface PostRecord {
  did: string;
  rkey: string;
  post: string;
  facets: Facet[];
  handle: string;
  nickname?: string;
  indexedAt: number;
}

export type { PostRecord };
