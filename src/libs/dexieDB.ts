import { Dexie, type EntityTable } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { defaultInputMap, type InputMap } from "snes9x2005-wasm";
const DB_VERSION = 1;

interface Games {
  id: number;
  name: string;
  rom: Uint8Array;
  createdAt: Date;
}

interface SaveStates {
  id: number;
  gameId: number;
  state: Uint8Array;
}

export interface Settings {
  id: string;
  inputMap: InputMap;
}

const db = new Dexie("FriendsDatabase") as Dexie & {
  games: EntityTable<Games, "id">;
  saveStates: EntityTable<SaveStates, "id">;
  settings: EntityTable<Settings, "id">;
};

db.version(DB_VERSION).stores({
  games: "id++",
  saveStates: "id++, gameId",
  settings: "id",
});

db.on("populate", () => {
  db.settings.add({
    id: "settings",
    inputMap: defaultInputMap,
  });
});

export const useGame = (id: number) =>
  useLiveQuery(() => (isNaN(id) ? undefined : db.games.get(id)), [id]);

export const useSettings = () =>
  useLiveQuery(() => db.settings.get("settings"));

export const updateInputMap = (map: InputMap) =>
  db.settings
    .where("id")
    .equals("settings")
    .modify((obj) => {
      obj.inputMap = { ...obj.inputMap, ...map };
    });

export const getGameList = () => useLiveQuery(() => db.games.toArray());
export const useGameStates = (key: number) =>
  useLiveQuery(
    () =>
      isNaN(key) ? [] : db.saveStates.where("gameId").equals(key).toArray(),
    [key],
  );

export const newGame = (file: File | null | undefined) =>
  db.transaction("rw", [db.games, db.saveStates], async () => {
    if (!file) return;
    const gameId = await db.games.add({
      rom: await file.bytes(),
      name: file.name,
      createdAt: new Date(),
    });
    db.saveStates.add({ gameId, state: new Uint8Array() });
  });

export const newState = (gameId: number) =>
  db.saveStates.add({ gameId, state: new Uint8Array() });

export const saveStateAtKey = (key: number, state: Uint8Array) =>
  db.saveStates.update(key, { state });

export const loadStateAtKey = (key: number) => db.saveStates.get(key);
