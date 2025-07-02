import React, { createContext, useContext, useState } from 'react';

type ModuleContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;
};

const ModuleContext = createContext<ModuleContextType>({
  activeModule: 'Core',
  setActiveModule: () => {},
});

export const ModuleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [activeModule, setActiveModule] = useState('Core');
  
  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
