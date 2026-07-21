import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      utils: path.resolve(root, 'utils'),
      'src/utils/types': path.resolve(root, 'test/unit/stubs/types.js'),
      'src/api/helpers': path.resolve(root, 'test/unit/stubs/api-helpers.js'),
      'src/event-bus': path.resolve(root, 'test/unit/stubs/event-bus.js'),
      vue: path.resolve(root, 'test/unit/stubs/vue.js'),
    },
  },
  plugins: [
    {
      name: 'stub-files-store',
      enforce: 'pre',
      resolveId (id, importer) {
        if (
          importer &&
          importer.includes(`${path.sep}file-actions.js`) &&
          (id === '../store/index-pinia' || id.endsWith('/store/index-pinia'))
        ) {
          return path.resolve(root, 'test/unit/stubs/files-store.js')
        }
      },
    },
  ],
  test: {
    environment: 'node',
    globals: true,
    include: ['test/unit/**/*.{spec,test}.{js,mjs}'],
  },
})
