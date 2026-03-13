import { useState, type JSX } from "react";
import { getGameList, newGame } from "../libs/dexieDB";
import useFileInput from "../libs/useFileInput";
import Game from "../icons/game";
import Close from "../icons/close";
import New from "../icons/new";

export default function useGameSelector(): [number, () => JSX.Element] {
  const [currentGame, setCurrentGame] = useState<number>(NaN);

  function GameSelection() {
    const [open, setOpen] = useState(isNaN(currentGame));
    const gameList = getGameList();
    const uploadRom = useFileInput((f) => newGame(f?.item(0)));

    return (
      <section className="selector">
        {open ? (
          <>
            <p>Game : </p>
            <select
              onChange={({ target }) => setCurrentGame(parseInt(target.value))}
              value={currentGame.toString()}
            >
              <option value={"NaN"} disabled>
                Select Rom
              </option>
              {gameList?.map(({ id, name }, key) => (
                <option value={id} key={key}>
                  {name}
                </option>
              ))}
            </select>

            <button onClick={uploadRom}>
              <New />
            </button>
            <button onClick={() => setOpen(false)}>
              <Close />
            </button>
          </>
        ) : (
          <button onClick={() => setOpen(true)}>
            <Game />
          </button>
        )}
      </section>
    );
  }
  return [currentGame, GameSelection];
}
