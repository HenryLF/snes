import { useCallback, useEffect, useState } from "react";
import { useEmulation } from "./libs/EmulationContext";
import useGameSelector from "./components/GameSelector";
import { loadStateAtKey, saveStateAtKey, useGame } from "./libs/dexieDB";
import useStateSelector from "./components/StateSelector";
import Controller from "./components/Controller";

function App() {
  const { ref, emulator } = useEmulation();

  const [gameKey, GameSelector] = useGameSelector();
  const [stateKey, StateSelector] = useStateSelector(gameKey);
  const gameData = useGame(gameKey);
  const [running, setRunning] = useState(false);
  const [emulationMenu, setEmulationMenu] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [fullscreen, setFullScreen] = useState(false);
  const [virtualPad, setVirtualPad] = useState(true);

  useEffect(() => {
    if (!gameData) return;
    emulator?.loadRom(gameData.rom);
    setRunning(true);
  }, [gameData]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    if (fullscreen) {
      root.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [fullscreen]);

  const toggleRun = useCallback(() => {
    if (!emulator) return;
    setRunning(emulator.toggleEmulation());
  }, [emulator]);

  const setEmulationSpeed = useCallback(
    (n: number) => {
      if (!emulator) return;
      setCurrentSpeed(emulator.setEmulationSpeed(n));
    },
    [emulator],
  );

  const saveState = useCallback(() => {
    if (!emulator) return;
    const state = emulator.saveState();
    console.log(state);
    if (!state) return;
    saveStateAtKey(stateKey, state);
  }, [emulator, stateKey]);

  const loadState = useCallback(async () => {
    if (!emulator) return;
    console.log(stateKey);
    const state = await loadStateAtKey(stateKey);
    if (!state) return;
    emulator.loadState(state.state);
  }, [emulator, stateKey]);

  const setVolume = useCallback(
    (n: number) => {
      if (!emulator) return;
      setCurrentVolume(emulator.setVolume(n));
    },
    [emulator],
  );

  return (
    <>
      <canvas className="canvas" ref={ref}></canvas>
      <section className="controls">
        {emulationMenu ? (
          <div className="emulator-control">
            <button onClick={toggleRun}>{running ? "Stop" : "Start"}</button>
            <div className="flex items-center">
              <button onClick={() => setEmulationSpeed(currentSpeed - 1)}>
                -
              </button>
              <div className="px-2">{currentSpeed}</div>
              <button onClick={() => setEmulationSpeed(currentSpeed + 1)}>
                +
              </button>
            </div>
            <button onClick={saveState}>Save</button>
            <button onClick={loadState}>Load</button>
            <input
              type="range"
              min={0}
              max={100}
              value={currentVolume}
              onChange={({ target }) => setVolume(target.valueAsNumber)}
            />
            <button onClick={() => setFullScreen((p) => !p)}>Fullscreen</button>
            <button onClick={() => setVirtualPad((p) => !p)}>
              {virtualPad ? "VP" : "nVP"}
            </button>
            <button
              className="w-fit self-center"
              onClick={() => setEmulationMenu(false)}
            >
              Close
            </button>
          </div>
        ) : (
          <button
            className="w-fit self-center"
            onClick={() => setEmulationMenu(true)}
          >
            Menu
          </button>
        )}
        {virtualPad && <Controller />}
      </section>
      <div className="selectors">
        <GameSelector />
        <StateSelector />
      </div>
    </>
  );
}

export default App;
