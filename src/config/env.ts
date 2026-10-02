/** Every environment variable the app reads, in one place. Vite only exposes VITE_* names. */
export const env = {
  /** Absolute API origin, or `/api` for the dev mock and same-origin deployments. */
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Starter',
  appTagline: import.meta.env.VITE_APP_TAGLINE ?? '',
  isDev: import.meta.env.DEV,
} as const;
