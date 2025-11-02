# Pre-commit Hooks Configuration

This document describes the pre-commit hooks setup for the project.

## Hooks Configured

1. **lint-staged** - formats and lints staged files
2. **vitest** - runs tests when test or source files are modified

## Usage

The hooks run automatically on `git commit`. You can also run them manually:

```bash
pnpm precommit          # Run the full pre-commit workflow
pnpm lint:staged        # Run only lint-staged
```
