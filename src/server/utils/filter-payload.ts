import { SyncPayload } from "@rbxts/charm-sync";
import { GlobalAtoms } from "shared/store";

export function filterPayload(
  player: Player,
  payload: SyncPayload<GlobalAtoms>,
) {
  if (payload.type === "init") {
    return {
      ...payload,
      data: {
        ...payload.data,
        "datastore/players": {
          [player.Name]: payload.data["datastore/players"][player.Name],
        },
      },
    };
  }

  return {
    ...payload,
    data: {
      ...payload.data,
      "datastore/players": payload.data["datastore/players"] && {
        [player.Name]: payload.data["datastore/players"][player.Name],
      },
    },
  };
}
