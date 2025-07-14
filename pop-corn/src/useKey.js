import { useEffect } from "react";

export function useKey(key, callback) {

    useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === key) {
        callback();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function - removes the listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback]);
}