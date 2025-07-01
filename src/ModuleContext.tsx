import React, { createContext, useContext, useState } from 'react';

interface ModuleContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState("HR");

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error("useModule must be used within a ModuleProvider");
  return context;
};
