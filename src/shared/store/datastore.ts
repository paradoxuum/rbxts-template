import { atom } from "@rbxts/charm";

export interface PlayerData {
  readonly money: number;
}

type PlayerDataMap = {
  readonly [K in string]?: PlayerData;
};

export const datastore = {
  players: atom<PlayerDataMap>({}),
};

export function getPlayerData(player: Player) {
  return datastore.players()[player.Name];
}

export function setPlayerData(player: Player, playerData: PlayerData) {
  datastore.players((state) => ({
    ...state,
    [player.Name]: playerData,
  }));
}

export function deletePlayerData(player: Player) {
  datastore.players((state) => ({
    ...state,
    [player.Name]: undefined,
  }));
}

export function updatePlayerData(
  player: Player,
  updater: (data: PlayerData) => PlayerData,
) {
  datastore.players((state) => {
    const currentState = state[player.Name];
    return {
      ...state,
      [player.Name]: currentState && updater(currentState),
    };
  });
}
