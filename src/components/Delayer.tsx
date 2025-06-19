import { type PropsWithChildren, useState, useEffect } from 'react';

type Delayer = {
  timer: number;
}

const Delayer = ({ timer = 0, children }: PropsWithChildren<Delayer>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), timer);
  });

  return (
    <>
    { mounted ? (<>{children}</>) : null }
    </>
  );
}

export { Delayer }