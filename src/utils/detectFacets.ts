import { AppBskyRichtextFacet, RichText } from "@atproto/api";
import { detectFacets as detect } from "@atproto/api/src/rich-text/detection.js";
import { resolveHandle } from "./api.js";

const facetSort = (
  a: AppBskyRichtextFacet.Main,
  b: AppBskyRichtextFacet.Main,
) => a.index.byteStart - b.index.byteStart;
const detectFacets = async (rt: RichText) => {
  rt.facets = detect(rt.unicodeText);
  if (rt.facets) {
    for (const facet of rt.facets) {
      for (const feature of facet.features) {
        if (AppBskyRichtextFacet.isMention(feature)) {
          const did = await resolveHandle(feature.did).catch((_) => undefined);
          feature.did = did || "";
        }
      }
    }
    rt.facets.sort(facetSort);
  }
  return rt;
};

export default detectFacets;
