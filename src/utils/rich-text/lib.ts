import { resolveHandle } from "../api.js";
import { UnicodeString } from "./unicode.js";
import { facetSort, isMention } from "./util.js";
import detect from "./detection.js";
import { SocialPskyRichtextFacet } from "@atcute/client/lexicons";

const detectFacets = async (text: string) => {
  let facets = detect(new UnicodeString(text));
  if (facets) {
    for (const facet of facets) {
      for (const feature of facet.features) {
        if (isMention(feature)) {
          const mention = feature as SocialPskyRichtextFacet.Mention;
          const did = await resolveHandle(mention.did).catch((_) => undefined);
          mention.did = did || "";
        }
      }
    }
    facets.sort(facetSort);
  }
  return facets;
};

export default detectFacets;
