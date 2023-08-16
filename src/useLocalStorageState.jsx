import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    console.log(storedValue);
    return storedValue ? JSON.parse(storedValue) : initialState; //retrieve data stored in watched as application loads
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

// const [watched, setWatched] = useState(function () {
//     const storedValue = localStorage.getItem("watched");
//     return JSON.parse(storedValue); //retrieve data stored in watched as application loads
//   });
