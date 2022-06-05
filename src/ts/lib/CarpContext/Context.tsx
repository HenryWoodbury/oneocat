import React, { createContext, useContext, useMemo } from 'react';

interface ICarpContext {
  theme: string;
  color: string;
}

const CarpContext = createContext<ICarpContext | null>(null);

export const useCarpContext = () => useContext(CarpContext);

interface IContextProps extends ICarpContext {
  children: React.ReactNode;
}

export default function Context({ children, ...contextVars }: IContextProps) {
  const value = useMemo(() => contextVars, [contextVars]);

  return (
    <CarpContext.Provider value={value}>{children}</CarpContext.Provider>
  );
}
