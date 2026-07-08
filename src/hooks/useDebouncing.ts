import { useEffect, useState } from "react";


export function useDebouncedState<T>(initialValue: T, delay: number): [T,T, React.Dispatch<React.SetStateAction<T>>] {
  const [search, setSearch] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(search);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return [search, debouncedValue, setSearch];
}

