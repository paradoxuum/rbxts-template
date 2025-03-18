import { Flamework } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { atoms } from "shared/store";
import { Events } from "./remotes";
import { filterPayload } from "./utils/filter-payload";

const syncer = CharmSync.server({ atoms });

syncer.connect((player, payload) => {
  Events.sync(player, filterPayload(player, payload));
});

Events.init.connect((player) => {
  syncer.hydrate(player);
});

Flamework.addPaths("src/server");
Flamework.ignite();
