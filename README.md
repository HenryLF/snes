# SNES emulator


An client only SNES emulator that store your rom and save data inside the browser indexed database.

The emulator is built on the Wasm port of [snes9x2005 by kazuki-4ys](https://github.com/kazuki-4ys/snes9x2005-wasm) for which a TypeScript compatible API is available [here](https://github.com/HenryLF/snes9x2005-wasm).


Note that the emulation is not accurate, the emulation is relying on reaquestAnimationFrame to handle the game loop resulting in variable game speed depending on your machine.