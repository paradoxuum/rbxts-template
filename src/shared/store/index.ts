import { AtomMap } from "@rbxts/charm-sync";
import { datastore } from "./datastore";
import { flattenAtoms } from "./utils/flatten-atoms";

export type GlobalAtoms = typeof atoms;

export const atoms = flattenAtoms({
  datastore,
});
