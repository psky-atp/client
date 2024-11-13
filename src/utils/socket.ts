import { GENERAL_ROOM_URI, SERVER_URL } from "./constants.js";
import { WebSocket } from "partysocket";

type SocketMessageKind =
  | "serverState"
  | "social.psky.chat.message#create"
  | "social.psky.chat.message#update"
  | "social.psky.chat.message#delete";

const callbacks = new Map<SocketMessageKind, Set<(data: any) => void>>();
callbacks.set("serverState", new Set());
callbacks.set("social.psky.chat.message#create", new Set());
callbacks.set("social.psky.chat.message#update", new Set());
callbacks.set("social.psky.chat.message#delete", new Set());

export const registerCallback = (
  eventNsid: SocketMessageKind,
  callback: (data: any) => void,
) => callbacks.get(eventNsid)?.add(callback);
export const unregisterCallback = (
  eventNsid: SocketMessageKind,
  callback: (data: any) => void,
) => callbacks.get(eventNsid)?.delete(callback);

// FIX: hardcoding the room uri
const socket = new WebSocket(
  `wss://${SERVER_URL}/subscribe?wantedRooms=${GENERAL_ROOM_URI}`,
);
socket.addEventListener("message", (event) => {
  let data = JSON.parse(event.data);
  switch (data.$type) {
    case "serverState":
      callbacks.get("serverState")?.forEach((cb) => cb(data));
      break;

    case "social.psky.chat.message#create":
      callbacks
        .get("social.psky.chat.message#create")
        ?.forEach((cb) => cb(data));
      break;

    case "social.psky.chat.message#update":
      callbacks
        .get("social.psky.chat.message#update")
        ?.forEach((cb) => cb(data));
      break;

    case "social.psky.chat.message#delete":
      callbacks
        .get("social.psky.chat.message#delete")
        ?.forEach((cb) => cb(data));
      break;
  }
});
