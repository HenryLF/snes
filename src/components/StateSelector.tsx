import { useCallback, useEffect, useState, type JSX } from "react";
import { newState, useGameStates } from "../libs/dexieDB";
import Close from "../icons/close";
import Save from "../icons/save";
import New from "../icons/new";

export default function useStateSelector(
  gameKey: number,
): [number, () => JSX.Element] {
  const stateList = useGameStates(gameKey);
  const [currentState, setCurrentState] = useState<number>(NaN);

  useEffect(() => {
    setCurrentState(stateList?.at(0)?.id ?? NaN);
  }, [stateList]);

  const createSaveState = useCallback(() => {
    newState(gameKey).then((newStateId) => setCurrentState(newStateId));
  }, [gameKey]);

  function StateSelector() {
    const [open, setOpen] = useState(false);
    if (isNaN(gameKey)) return <></>;
    return (
      <section className="selector">
        {open ? (
          <>
            <p>SaveState : </p>
            <select
              value={currentState.toString()}
              onChange={({ currentTarget }) => {
                setCurrentState(parseInt(currentTarget.value));
              }}
            >
              <option disabled value={"NaN"}>
                --
              </option>
              {stateList?.map((state, key) => (
                <option value={state.id} key={key}>
                  {key}
                </option>
              ))}
            </select>
            <button onClick={createSaveState}><New/></button>
            <button onClick={() => setOpen(false)}>
              <Close />
            </button>
          </>
        ) : (
          <button onClick={() => setOpen(true)}>
            <Save />
          </button>
        )}
      </section>
    );
  }

  return [currentState, StateSelector];
}
