import { SERVER_URL } from "./constants.js";
import { WebSocket } from "partysocket";

type SocketMessageKind =
  | "serverState"
  | "social.psky.feed.post#create"
  | "social.psky.feed.post#update"
  | "social.psky.feed.post#delete";

const callbacks = new Map<SocketMessageKind, Set<(data: any) => void>>();
callbacks.set("serverState", new Set());
callbacks.set("social.psky.feed.post#create", new Set());
callbacks.set("social.psky.feed.post#update", new Set());
callbacks.set("social.psky.feed.post#delete", new Set());

export const registerCallback = (
  eventNsid: SocketMessageKind,
  callback: (data: any) => void,
) => callbacks.get(eventNsid)?.add(callback);
export const unregisterCallback = (
  eventNsid: SocketMessageKind,
  callback: (data: any) => void,
) => callbacks.get(eventNsid)?.delete(callback);

const socket = new WebSocket(`wss://${SERVER_URL}/subscribe`);
socket.addEventListener("message", (event) => {
  let data = JSON.parse(event.data);
  switch (data.$type) {
    case "serverState":
      callbacks.get("serverState")?.forEach((cb) => cb(data));
      break;

    case "social.psky.feed.post#create":
      callbacks.get("social.psky.feed.post#create")?.forEach((cb) => cb(data));
      break;

    case "social.psky.feed.post#update":
      callbacks.get("social.psky.feed.post#update")?.forEach((cb) => cb(data));
      break;

    case "social.psky.feed.post#delete":
      callbacks.get("social.psky.feed.post#delete")?.forEach((cb) => cb(data));
      break;
  }
});
