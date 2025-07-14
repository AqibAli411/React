import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialState;
  });

  // watched is basically the value state -> a changed in watched is change in value state
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
