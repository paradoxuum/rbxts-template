import { Networking } from "@flamework/networking";
import { SyncPayload } from "@rbxts/charm-sync";
import { GlobalAtoms } from "./store";

interface ClientToServerEvents {
  init(): void;
}

interface ServerToClientEvents {
  sync(payload: SyncPayload<GlobalAtoms>): void;
}

export const GlobalEvents = Networking.createEvent<
  ClientToServerEvents,
  ServerToClientEvents
>();
