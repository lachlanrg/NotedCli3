// ThemeContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  const toggleColorScheme = () => {
    const nextScheme: ColorSchemeName = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(nextScheme);
    // You can also save the color scheme to persistent storage here (e.g., AsyncStorage)
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
