import { DefaultTheme, Theme } from '@react-navigation/native';
import { colors } from '../Components/ui/theme';

// White screens (React Navigation's default background is light grey) and brand accents.
export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};
