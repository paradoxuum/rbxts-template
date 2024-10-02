import { Networking } from "@flamework/networking";
import { AtomMap, SyncPayload } from "@rbxts/charm";

interface ClientToServerEvents {
	init(): void;
}

interface ServerToClientEvents {
	sync(payload: SyncPayload<AtomMap>): void;
}

export const GlobalEvents = Networking.createEvent<
	ClientToServerEvents,
	ServerToClientEvents
>();
