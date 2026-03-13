import { SNES_CONTROL } from "snes9x2005-wasm";
import { useEmulation } from "../libs/EmulationContext";
import { useCallback } from "react";
import "./Controller.css";

export default function Controller() {
  const { emulator } = useEmulation();

  const handle = useCallback(
    (input: SNES_CONTROL) => ({
      onMouseDown: () => {
        emulator?.inputHandle(input);
      },
      onTouchStart: () => {
        emulator?.inputHandle(input);
      },
      onTouchEnd: () => {
        emulator?.inputHandle(input, false);
      },
      onMouseUp: () => {
        emulator?.inputHandle(input, false);
      },
    }),
    [emulator],
  );
  emulator?.createKeyboardHandles({ a: SNES_CONTROL.A }, true);

  return (
    <section className="controller">
      <div className="shoulders my-2">
        <button {...handle(SNES_CONTROL.L)}>L</button>
        <button {...handle(SNES_CONTROL.R)}>R</button>
      </div>
      <div className="flex items-center justify-between w-full ">
        <div className="dpad">
          <button
            className="col-start-2 row-start-1"
            {...handle(SNES_CONTROL.UP)}
          />
          <button
            className="col-start-1 row-start-2"
            {...handle(SNES_CONTROL.LEFT)}
          />

          <button
            className="col-start-2 row-start-3"
            {...handle(SNES_CONTROL.DOWN)}
          />
          <button
            className="col-start-3 row-start-2"
            {...handle(SNES_CONTROL.RIGHT)}
          />
        </div>

        <div className="options">
          <button {...handle(SNES_CONTROL.SELECT)}>SELECT</button>
          <button {...handle(SNES_CONTROL.START)}>START</button>
        </div>

        <div className="actions">
          <button
            className="col-start-3 row-start-2 bg-[#BF0319]!"
            {...handle(SNES_CONTROL.A)}
          >
            A
          </button>
          <button
            className="col-start-2 row-start-3 bg-[#E3B72F]!"
            {...handle(SNES_CONTROL.B)}
          >
            B
          </button>
          <button
            className="col-start-2 row-start-1 bg-[#004DBC]!"
            {...handle(SNES_CONTROL.X)}
          >
            X
          </button>
          <button
            className="col-start-1 row-start-2 bg-[#018552]!"
            {...handle(SNES_CONTROL.Y)}
          >
            Y
          </button>
        </div>
      </div>
    </section>
  );
}
