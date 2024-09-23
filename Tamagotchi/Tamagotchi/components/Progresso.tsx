import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useProductDatabase } from '../app/database/Service';

interface ProgressContextType {
  hunger: number;
  sleep: number;
  fun: number;
  status: number;
  incrementHunger: (value: number) => void;
  incrementSleep: (value: number) => void;
  incrementFun: (value: number) => void;
  setInitialValues: (initialValues: { hunger: number; sleep: number; fun: number }) => void;
}

const defaultState = {
  hunger: 100,
  sleep: 100,
  fun: 100,
  status: 300,
  incrementHunger: () => {},
  incrementSleep: () => {},
  incrementFun: () => {},
  setInitialValues: () => {},
};

const ProgressContext = createContext<ProgressContextType>(defaultState);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hunger, setHunger] = useState(100);
  const [sleep, setSleep] = useState(100);
  const [fun, setFun] = useState(100);

  const productDatabase = useProductDatabase();

  const setInitialValues = ({ hunger, sleep, fun }: { hunger: number; sleep: number; fun: number }) => {
    setHunger(hunger);
    setSleep(sleep);
    setFun(fun);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger(prev => Math.max(prev - 1, 0));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSleep(prev => Math.max(prev - 1, 0));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFun(prev => Math.max(prev - 1, 0));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const incrementHunger = (value: number) => setHunger(prev => Math.min(prev + value, 100));
  const incrementSleep = (value: number) => setSleep(prev => Math.min(prev + value, 100));
  const incrementFun = (value: number) => setFun(prev => Math.min(prev + value, 100));

  const status = Math.min(hunger + sleep + fun, 300);

  return (
    <ProgressContext.Provider
      value={{
        hunger,
        sleep,
        fun,
        status,
        incrementHunger,
        incrementSleep,
        incrementFun,
        setInitialValues,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
