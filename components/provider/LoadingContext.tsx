import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  loadingStep: number;
  showGlobalLoading: (message: string, duration?: number) => Promise<void>;
  hideGlobalLoading: () => Promise<void>;
  updateLoadingProgress: (step: number, message: string) => void;
  isGlobalLoading: boolean;
  withLoading: <T>(operation: () => Promise<T>, message: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState(1);

  const showGlobalLoading = async (message: string, duration?: number) => {
    setLoadingMessage(message);
    setLoadingStep(1);
    setIsLoading(true);
    
    // Auto-hide after duration if specified
    if (duration) {
      setTimeout(() => {
        hideGlobalLoading();
      }, duration);
    }
  };

  const hideGlobalLoading = async () => {
    setIsLoading(false);
    setLoadingMessage('');

  };

  const updateLoadingProgress = (step: number, message: string) => {
    setLoadingStep(step);
    setLoadingMessage(message);
  };

  const withLoading = async <T,>(operation: () => Promise<T>, message: string): Promise<T> => {
    try {
      await showGlobalLoading(message);
      const result = await operation();
      return result;
    } finally {
      await hideGlobalLoading();
    }
  };

  const value: LoadingContextType = {
    isLoading,
    loadingMessage,
    loadingStep,
    showGlobalLoading,
    hideGlobalLoading,
    updateLoadingProgress,
    isGlobalLoading: isLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 