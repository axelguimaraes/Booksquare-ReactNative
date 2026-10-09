// Design tokens. Values come from the existing look (brand brown, light surfaces, grey tags);
// screens use these instead of hard-coded colors and sizes so the UI stays consistent.

export const colors = {
  primary: '#8C756A',
  primaryLight: '#b9aaa3',
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceAlt: '#EFEFEF',
  tag: '#DADADA',
  border: '#DADADA',
  inputBorder: '#C7C7C7',
  text: '#1C1C1E',
  // #666 keeps secondary text above the WCAG AA 4.5:1 contrast ratio on white.
  textSecondary: '#666666',
  placeholder: '#8E8E93',
  danger: '#B3261E',
  bubbleOwn: '#b9aaa3',
  bubbleOther: '#E5E5EA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 10,
  pill: 999,
};

export const typography = {
  title: { fontSize: 20, fontWeight: 'bold' as const },
  heading: { fontSize: 18, fontWeight: 'bold' as const },
  body: { fontSize: 16 },
  label: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 14 },
  small: { fontSize: 12 },
};

// Minimum touch target (Apple HIG 44pt, Material 48dp).
export const touchTarget = 48;
