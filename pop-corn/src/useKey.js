import { useEffect } from "react";

export function useKey(key,constraint,...callbacks){
    console.log(callbacks);
    useEffect(() => {
      function handleKeyDown(e) {
        if (constraint) return;

        if (e.code === key) {
          callbacks.forEach((callback) => callback());
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup function - removes the listener
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [callbacks, key, constraint]);
 
}