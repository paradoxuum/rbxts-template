import { Flamework } from "@flamework/core";
import { sync } from "@rbxts/charm";
import { atoms } from "shared/store/sync";
import { Events } from "./networking";

const server = sync.server({ atoms });

Events.init.connect((player) => server.hydrate(player));
server.connect((player, payload) => {
	Events.sync(player, payload);
});

Flamework.addPaths("src/server");
Flamework.ignite();
