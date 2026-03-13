import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import { Emulator, type EmulatorOption } from "snes9x2005-wasm";
import { useSettings } from "./dexieDB";

const emulationContext = createContext<{
  emulator: Emulator | null;
  ref: RefObject<HTMLCanvasElement | null>;
} | null>(null);

export default function EmulationContext({
  children,
  ...options
}: PropsWithChildren & Partial<EmulatorOption>) {
  const [emulator, setEmulator] = useState<Emulator | null>(null);

  const settings = useSettings();
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      Emulator.create(ref.current, options).then(setEmulator);
    }
    return () => emulator?.destroy();
  }, [ref]);

  useEffect(() => {
    if (!settings || !emulator) return;
    const { onkeydown, onkeyup } = emulator.createKeyboardHandles(
      settings.inputMap,
      false,
    );
    window.onkeyup = onkeyup;
    window.onkeydown = onkeydown;
    return () => {
      window.onkeyup = () => {};
      window.onkeydown = () => {};
    };
  }, [settings, emulator]);

  return (
    <emulationContext.Provider value={{ emulator, ref }}>
      {children}
    </emulationContext.Provider>
  );
}

export function useEmulation() {
  const ctx = use(emulationContext);
  if (!ctx) throw new Error("No context provider");
  return ctx;
}
