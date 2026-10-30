import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// KAZ_LOCAL=../kaz-design-system usa o Kaz direto do código-fonte, sem precisar do pacote publicado.
const kazLocal = process.env.KAZ_LOCAL;

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: kazLocal
    ? {
        alias: [
          { find: '@silvestrev/kaz/styles.css', replacement: resolve(kazLocal, 'src/styles/index.css') },
          { find: '@silvestrev/kaz', replacement: resolve(kazLocal, 'src/index.ts') },
        ],
      }
    : undefined,
});
