#!/usr/bin/env bash

set -euo pipefail

pnpm --package=vitest@0.33.0 --package=@vitest/coverage-v8@0.33.0 dlx -c '
  dlx_node_modules="$(dirname "$(dirname "$(command -v vitest)")")"
  mkdir -p node_modules/@vitest
  ln -sfn "$dlx_node_modules/@vitest/coverage-v8" node_modules/@vitest/coverage-v8
  vitest run --globals \
    --coverage.enabled \
    --coverage.all \
    --coverage.include=src/**/*.ts \
    --coverage.provider=v8 \
    --coverage.reporter=text \
    --coverage.reporter=json \
    --coverage.reporter=json-summary \
    --coverage.reporter=lcov \
    --coverage.reporter=cobertura
'
