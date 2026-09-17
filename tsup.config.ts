import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // tsup's DTS build injects `baseUrl: '.'`, which TypeScript 6 deprecates (TS5101).
  // Scoped to the DTS build only; tsc --noEmit still reports it for our own config.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-redux', '@reduxjs/toolkit', '@norbix.ai/ts'],
});
