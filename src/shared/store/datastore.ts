import { atom } from "@rbxts/charm";
import Remap from "@rbxts/remap";

export interface PlayerData {
	readonly money: number;
}

export const datastore = {
	players: atom(new ReadonlyMap<string, PlayerData>()),
};

export function getPlayerData(player: Player) {
	return datastore.players().get(player.Name);
}

export function setPlayerData(player: Player, data: PlayerData) {
	datastore.players((state) => Remap.set(state, player.Name, data));
}

export function deletePlayerData(player: Player) {
	datastore.players((state) => Remap.delete(state, player.Name));
}

export function updatePlayerData(
	player: Player,
	updater: (data: PlayerData) => PlayerData,
) {
	datastore.players((state) => Remap.change(state, player.Name, updater));
}
