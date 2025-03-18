import CharmSync from "@rbxts/charm-sync";
import { atoms } from "shared/store";
import { Events } from "./remotes";
import { Flamework } from "@flamework/core";
import { mount } from "@rbxts/vide";
import Vide from "@rbxts/vide";
import { Players } from "@rbxts/services";
import { App } from "./ui/app";

const syncer = CharmSync.client({ atoms });
Events.sync.connect((payload) => {
  syncer.sync(payload);
});
Events.init();

Flamework.addPaths("src/client");
Flamework.ignite();
mount(() => <App />, Players.LocalPlayer.WaitForChild("PlayerGui"));
