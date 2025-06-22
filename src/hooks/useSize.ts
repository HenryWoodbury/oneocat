import { useLayoutEffect, useState, type RefObject } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

type Target = RefObject<HTMLElement | null>;

const useSize = (target: Target)  => {
  const [size, setSize] = useState<DOMRect>();
  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export { useSize };