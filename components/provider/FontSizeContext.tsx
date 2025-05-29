// FontSizeContext.tsx
import React, { createContext, useState } from 'react';

const DEFAULT_FONT_SIZE = 24;

interface FontSizeContextProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

interface FontSizeProviderProps {
  children: React.ReactNode;
}

export const FontSizeContext = createContext<FontSizeContextProps>({
  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: () => {},
});

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

  

  