import TLDs from "tlds";
import { Facet } from "./defs.js";
import { UnicodeString } from "./unicode.js";
import {
  URL_REGEX,
  MENTION_REGEX,
  TAG_REGEX as ROOM_REGEX,
  TRAILING_PUNCTUATION_REGEX,
} from "./util.js";

export default function detect(text: UnicodeString): Facet[] | undefined {
  const facets: Facet[] = [];

  let match;
  match = detectMentions(match, text, facets);
  match = detectLinks(match, text, facets);
  match = detectRooms(match, text, facets);

  return facets.length > 0 ? facets : undefined;
}

function detectMentions(match: any, text: UnicodeString, facets: Facet[]) {
  const re = MENTION_REGEX;
  while ((match = re.exec(text.utf16))) {
    if (!isValidDomain(match[3]) && !match[3].endsWith(".test")) {
      continue; // probably not a handle
    }

    const start = text.utf16.indexOf(match[3], match.index) - 1;
    facets.push({
      $type: "social.psky.richtext.facet",
      index: {
        byteStart: text.utf16IndexToUtf8Index(start),
        byteEnd: text.utf16IndexToUtf8Index(start + match[3].length + 1),
      },
      features: [
        {
          $type: "social.psky.richtext.facet#mention",
          did: match[3], // must be resolved afterwards
        },
      ],
    });
  }
  return match;
}

function detectLinks(match: any, text: UnicodeString, facets: Facet[]) {
  const re = URL_REGEX;
  while ((match = re.exec(text.utf16))) {
    let uri = match[2];
    if (!uri.startsWith("http")) {
      const domain = match.groups?.domain;
      if (!domain || !isValidDomain(domain)) {
        continue;
      }
      uri = `https://${uri}`;
    }
    const start = text.utf16.indexOf(match[2], match.index);
    const index = { start, end: start + match[2].length };
    // strip ending puncuation
    if (/[.,;:!?]$/.test(uri)) {
      uri = uri.slice(0, -1);
      index.end--;
    }
    if (/[)]$/.test(uri) && !uri.includes("(")) {
      uri = uri.slice(0, -1);
      index.end--;
    }
    facets.push({
      index: {
        byteStart: text.utf16IndexToUtf8Index(index.start),
        byteEnd: text.utf16IndexToUtf8Index(index.end),
      },
      features: [
        {
          $type: "social.psky.richtext.facet#link",
          uri,
        },
      ],
    });
  }
  return match;
}
function isValidDomain(str: string): boolean {
  return !!TLDs.find((tld) => {
    const i = str.lastIndexOf(tld);
    if (i === -1) {
      return false;
    }
    return str.charAt(i - 1) === "." && i === str.length - tld.length;
  });
}

function detectRooms(match: any, text: UnicodeString, facets: Facet[]) {
  const re = ROOM_REGEX;
  while ((match = re.exec(text.utf16))) {
    const leading = match[1];
    let room = match[2];

    if (!room) continue;

    // strip ending punctuation and any spaces
    room = room.trim().replace(TRAILING_PUNCTUATION_REGEX, "");

    if (room.length === 0 || room.length > 64) continue;

    const index = match.index + leading.length;

    facets.push({
      index: {
        byteStart: text.utf16IndexToUtf8Index(index),
        byteEnd: text.utf16IndexToUtf8Index(index + 1 + room.length),
      },
      features: [
        {
          $type: "social.psky.richtext.facet#room",
          room: room,
        },
      ],
    });
  }
  return match;
}
