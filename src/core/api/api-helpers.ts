import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiErrorBody } from '@/types';

/** Unwraps `data` from an axios call. Services return domain types, never responses. */
export const apiCall = async <T>(fn: () => Promise<AxiosResponse<T>>): Promise<T> => {
  const { data } = await fn();
  return data;
};

/** A message fit for a screen, from whatever the API or the network threw. */
export function apiMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message) return message;
    if (!error.response) return 'The server could not be reached.';
  }
  return error instanceof Error && error.message ? error.message : fallback;
}
