import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // lazy evaluation: no argument is allowed in the callback function, function is only executed on the initial render

  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : initialState;
    // return JSON.parse(storedValue) || initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
