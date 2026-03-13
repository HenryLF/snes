import { SNES_CONTROL, SNES_CONTROL_KEYS } from "snes9x2005-wasm";
import { updateInputMap, useSettings } from "../libs/dexieDB";
import { useState } from "react";

export default function InputSelector() {
  const settings = useSettings();
  const [selectedInput, setSelected] = useState(NaN);

  const editInputHandle = async (input: string, key: number) => {
    setSelected(key);
    const newInput = await waitForInput();
    if (newInput) {
      /* @ts-expect-error */
      await updateInputMap({ [SNES_CONTROL[input]]: newInput });
    }
    setSelected(NaN);
  };

  return (
    <div className="bg-gray w-full flex flex-col items-center">
      {SNES_CONTROL_KEYS.map((input, key) => (
        <fieldset
          key={key}
          onClick={() => {
            editInputHandle(input, key);
          }}
          className={key == selectedInput ? "border-red-300 border" : ""}
        >
          {/* @ts-expect-error */}
          {input} : {settings?.inputMap[SNES_CONTROL[input]]}
        </fieldset>
      ))}
      <button
        onClick={async () => {
          for (let key = 0; key <= SNES_CONTROL_KEYS.length; key++) {
            await editInputHandle(SNES_CONTROL_KEYS[key], key);
          }
        }}
      >
        Assign All
      </button>
    </div>
  );
}

function waitForInput() {
  return new Promise<string | undefined>((r) => {
    const handle = (ev: KeyboardEvent) => {
      r(ev.key == "Escape" ? undefined : ev.key);
    };
    window.addEventListener("keydown", handle, { once: true });
  });
}
