/**
 * Centralized logger utility
 * Single place for all console logging with easy migration to external services
 */

/* eslint-disable no-console */
export const logger = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
} as const
