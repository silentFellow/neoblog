import { useState } from "react";

const useObject = <K extends string, T>(
  initialData: Record<K, T>,
): [Record<K, T>, (key: K, val: T | ((prev: T) => T)) => void] => {
  const [data, setData] = useState(initialData);

  const changeData = (key: K, val: T | ((prev: T) => T)) => {
    setData((prevData) => ({
      ...prevData,
      [key]:
        typeof val === "function"
          ? (val as (prev: T) => T)(prevData[key])
          : val,
    }));
  };

  return [data, changeData];
};

export default useObject;
