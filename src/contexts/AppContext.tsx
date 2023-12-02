import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextData {
  isLoading: boolean;
}
export const AppContext = createContext<AppContextData>(
  {} as AppContextData
);

export const AppProvider: React.FC<{}> = ({ children }: any) => {
  const [isLoading, setisLoading] = useState(true);
  
  return (
    <AppContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export function useAuth(): AppContextData {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }

  return context;
}
