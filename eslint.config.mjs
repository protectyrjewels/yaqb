// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = {
  ignores: ['**/dist/*', '**/types/*']
}

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  config
);
