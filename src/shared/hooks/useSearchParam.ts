import { useSearchParams } from 'react-router-dom';

/** One query-string value as state, so a filter survives reload and is linkable. */
export function useSearchParam(name: string): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(name) ?? '';
  const set = (next: string) => {
    setParams((p) => {
      if (next) p.set(name, next); else p.delete(name);
      return p;
    }, { replace: true });
  };
  return [value, set];
}
