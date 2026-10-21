import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Anything outside src/data must reach data through repositories (via hooks), never
// by importing mock data, zip centroids, or touching localStorage directly.
const dataLayerOnlyPatterns = [
  {
    group: ['**/data/mock/*', '**/data/mock', '**/zipCentroids.json', '**/spots.json'],
    message: 'Go through the repositories (useSpots(), useSavedPlaces(), ...) instead.',
  },
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'src/data/supabase/database.types.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat['recommended-latest'],
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },
  {
    files: ['src/{components,pages,hooks,lib,context}/**/*.{ts,tsx}', 'src/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', { patterns: dataLayerOnlyPatterns }],
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: 'Use SavedPlacesRepository / SettingsRepository.',
        },
        { name: 'sessionStorage', message: 'Use a repository.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'window', property: 'localStorage', message: 'Use a repository.' },
      ],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
)
