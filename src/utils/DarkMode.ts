// DarkMode.ts

import { Appearance, ColorSchemeName } from 'react-native';

// Function to toggle the color scheme between 'light' and 'dark'
export const toggleColorScheme = (): void => {
  const scheme: ColorSchemeName = Appearance.getColorScheme();
  const nextScheme: ColorSchemeName = scheme === 'dark' ? 'light' : 'dark';
  Appearance.setColorScheme(nextScheme);
};
