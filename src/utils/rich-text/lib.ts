import { resolveHandle } from "../api.js";
import { Facet } from "./defs.js";
import { UnicodeString } from "./unicode.js";
import { isMention } from "./util.js";
import detect from "./detection.js";

const facetSort = (a: Facet, b: Facet) => a.index.byteStart - b.index.byteStart;
const detectFacets = async (text: string) => {
  let facets = detect(new UnicodeString(text));
  if (facets) {
    for (const facet of facets) {
      for (const feature of facet.features) {
        if (isMention(feature)) {
          const did = await resolveHandle(feature.did).catch((_) => undefined);
          feature.did = did || "";
        }
      }
    }
    facets.sort(facetSort);
  }
  return facets;
};

export default detectFacets;
