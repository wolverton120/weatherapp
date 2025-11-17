import { useState, useCallback, createContext, useContext } from 'react';

const UnitContext = createContext();

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState("C");

  const convertTemp = useCallback((c) => (unit === "C" ? c : (c * 9) / 5 + 32), [unit]);
  
  const convertWindSpeed = useCallback((ms) => {
    if (unit === "C") {
      return ms.toFixed(1) + " m/s";
    } else {
      return (ms * 2.237).toFixed(1) + " mph";
    }
  }, [unit]);
  
  const convertPressure = useCallback((hPa) => {
    if (unit === "C") {
      return hPa + " hPa";
    } else {
      return (hPa * 0.02953).toFixed(2) + " inHg";
    }
  }, [unit]);
  
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const contextValue = {
    unit,
    setUnit,
    convertTemp,
    convertWindSpeed,
    convertPressure,
    formatTime
  };

  return (
    <UnitContext.Provider value={contextValue}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnitContext() {
  return useContext(UnitContext);
}