import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      utils: path.resolve(root, 'utils'),
      // Files utils import Core aliases; stub them for pure helper tests.
      'src/utils/types': path.resolve(root, 'test/unit/stubs/types.js'),
      'src/api/helpers': path.resolve(root, 'test/unit/stubs/api-helpers.js'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['test/unit/**/*.{spec,test}.{js,mjs}'],
  },
})
