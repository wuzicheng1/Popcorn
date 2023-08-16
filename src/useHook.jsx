import { useEffect, useRef, setQuery as action } from "react";

export function useKey(key, action) {
  const inputEl = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputEl.current) return;

      if (e.code === key) {
        inputEl.current.focus();
        action("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [action, key]);
}
