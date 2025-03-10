import { useState, useEffect } from "react";

const useStoredColor = (
  key: string,
  defaultColor: string
): [string, (color: string) => void] => {
  const [color, setColor] = useState<string>(() => {
    return localStorage.getItem(key) || defaultColor;
  });

  useEffect(() => {
    localStorage.setItem(key, color);
  }, [key, color]);

  return [color, setColor];
};

export default useStoredColor;
