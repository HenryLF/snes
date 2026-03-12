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


const emulationContext = createContext<{
  emulator: Emulator | null;
  ref: RefObject<HTMLCanvasElement | null>;
} | null>(null);

export default function EmulationContext({
  children,
  ...options
}: PropsWithChildren & Partial<EmulatorOption>) {
  const [emulator, setEmulator] = useState<Emulator | null>(null);

  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      Emulator.create(ref.current, options).then(setEmulator);
    }
    return () => emulator?.destroy();
  }, [ref]);

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
