import { BSKY_PUB_API_URL } from "./constants.js";

const resolveDid = async (did: string) => {
  const res = await fetch(
    did.startsWith("did:web") ?
      `https://${did.split(":")[2]}/.well-known/did.json`
    : "https://plc.directory/" + did,
  );

  return res.json().then((doc) => {
    for (const alias of doc.alsoKnownAs) {
      if (alias.includes("at://")) {
        return alias.split("//")[1];
      }
    }
  });
};

const resolveHandle = async (handle: string) => {
  const res = await fetch(
    `https://${BSKY_PUB_API_URL}/xrpc/com.atproto.identity.resolveHandle?handle=` +
      handle,
  );

  return res.json().then((json) => json.did);
};

export { resolveDid, resolveHandle };
