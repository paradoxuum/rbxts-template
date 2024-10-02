import { Flamework } from "@flamework/core";
import { sync } from "@rbxts/charm";
import { Players } from "@rbxts/services";
import Vide, { mount } from "@rbxts/vide";
import { atoms } from "shared/store/sync";
import { Events } from "./networking";
import { App } from "./ui/app";

const client = sync.client({ atoms });

Events.sync.connect((payload) => client.sync(payload));
Events.init();

Flamework.addPaths("src/client");
Flamework.ignite();

mount(() => <App />, Players.LocalPlayer.WaitForChild("PlayerGui"));
