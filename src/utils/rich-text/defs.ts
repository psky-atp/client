export interface ByteSlice {
  byteStart: number;
  byteEnd: number;
  [k: string]: unknown;
}
/** Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID. */
export interface Mention {
  did: string;
  [k: string]: unknown;
}
/** Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL. */
export interface Link {
  uri: string;
  [k: string]: unknown;
}
/** Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags'). */
export interface Room {
  room: string;
  [k: string]: unknown;
}
export interface Facet {
  index: ByteSlice;
  features: (Mention | Link | Room | { $type: string; [k: string]: unknown })[];
  [k: string]: unknown;
}
