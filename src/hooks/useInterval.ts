import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback])

  useEffect(() => {
    const schedule = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(schedule);
  }, [])
}

export default useInterval;