import { Flamework, Modding, OnStart, Service } from "@flamework/core";
import { effect } from "@rbxts/charm";
import { Collection, Document, createCollection } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import {
	PlayerData,
	deletePlayerData,
	getPlayerData,
	setPlayerData,
} from "shared/store/datastore";

const DEFAULT_DATA: PlayerData = {
	money: 0,
};

/**
 * Hook for when a player joins the game.
 *
 * This hook is called after the player's data has been loaded.
 */
export interface OnPlayerJoin {
	onPlayerJoin(player: Player): void;
}

/**
 * Hook for when a player leaves the game.
 *
 * This hook is called before the player's data has been saved.
 */
export interface OnPlayerLeave {
	onPlayerLeave(player: Player): void;
}

interface PlayerConnection {
	document: Document<PlayerData>;
	unsubscribe: () => void;
}

@Service()
export class DataService implements OnStart {
	private readonly joinListeners = new Set<OnPlayerJoin>();
	private readonly leaveListeners = new Set<OnPlayerLeave>();
	private readonly connections = new Map<Player, PlayerConnection>();
	private collection?: Collection<PlayerData>;

	constructor() {
		pcall(() => {
			this.collection = createCollection<PlayerData>("PlayerData", {
				defaultData: DEFAULT_DATA,
				validate: Flamework.createGuard<PlayerData>(),
			});
		});
	}

	onStart() {
		Modding.onListenerAdded<OnPlayerJoin>((object) =>
			this.joinListeners.add(object),
		);
		Modding.onListenerAdded<OnPlayerLeave>((object) =>
			this.leaveListeners.add(object),
		);

		Modding.onListenerRemoved<OnPlayerJoin>((object) =>
			this.joinListeners.delete(object),
		);
		Modding.onListenerRemoved<OnPlayerLeave>((object) =>
			this.leaveListeners.delete(object),
		);

		Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.onPlayerRemoving(player));

		for (const player of Players.GetPlayers()) {
			this.onPlayerAdded(player);
		}
	}

	private onPlayerAdded(player: Player) {
		let callListeners = true;
		this.loadPlayerData(player)
			.then((loaded) => {
				callListeners = loaded;
			})
			.catch((err) => {
				warn(`Failed to load player data for ${player.Name}: ${err}`);
				setPlayerData(player, DEFAULT_DATA);
			})
			.finally(() => {
				if (!callListeners) return;
				for (const listener of this.joinListeners) {
					listener.onPlayerJoin(player);
				}
			});
	}

	private onPlayerRemoving(player: Player) {
		const connection = this.connections.get(player);
		this.connections.delete(player);

		connection?.unsubscribe();
		for (const listener of this.leaveListeners) {
			listener.onPlayerLeave(player);
		}

		if (connection) {
			this.writeData(player, connection.document);
			connection.document.close();
		}

		deletePlayerData(player);
	}

	private async loadPlayerData(player: Player) {
		if (this.collection === undefined) {
			setPlayerData(player, DEFAULT_DATA);
			return true;
		}

		const document = await this.collection.load(`${player.UserId}`, [
			player.UserId,
		]);
		if (!player.IsDescendantOf(Players)) {
			document.close();
			return false;
		}

		const unsubscribe = effect(() => this.writeData(player, document));
		this.connections.set(player, {
			document,
			unsubscribe,
		});
		setPlayerData(player, document.read());
		return true;
	}

	private writeData(player: Player, document: Document<PlayerData>) {
		const data = getPlayerData(player);
		if (data) {
			document.write(data);
		}
	}
}
