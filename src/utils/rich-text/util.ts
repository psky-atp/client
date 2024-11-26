import type { SocialPskyRichtextFacet } from "@atcute/client/lexicons";

export const MENTION_REGEX = /(^|\s|\()(@)([a-zA-Z0-9.-]+)(\b)/g;
export const URL_REGEX = /(^|\s|\()((https?:\/\/[\S]+)|((?<domain>[a-z][a-z0-9]*(\.[a-z0-9]+)+)[\S]*))/gim;
export const TRAILING_PUNCTUATION_REGEX = /\p{P}+$/gu;

/**
 * `\ufe0f` emoji modifier
 * `\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2` zero-width spaces (likely incomplete)
 */
export const TAG_REGEX =
  // eslint-disable-next-line no-misleading-character-class
  /(^|\s)[#＃]((?!\ufe0f)[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*[^\d\s\p{P}\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]+[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*)?/gu;

type Facet = SocialPskyRichtextFacet.Main;
export const facetSort = (a: Facet, b: Facet) => a.index.byteStart - b.index.byteStart;

export function isMention(v: unknown): v is SocialPskyRichtextFacet.Mention {
  return isObj(v) && hasProp(v, "$type") && v.$type === "social.psky.richtext.facet#mention";
}
export function isLink(v: unknown): v is SocialPskyRichtextFacet.Link {
  return isObj(v) && hasProp(v, "$type") && v.$type === "social.psky.richtext.facet#link";
}
export function isRoom(v: unknown): v is SocialPskyRichtextFacet.Room {
  return isObj(v) && hasProp(v, "$type") && v.$type === "social.psky.richtext.facet#room";
}

export function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function hasProp<K extends PropertyKey>(data: object, prop: K): data is Record<K, unknown> {
  return prop in data;
}
