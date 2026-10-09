import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, touchTarget, typography } from './theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  // Content shown inside the field after the input, e.g. a show-password toggle or a unit.
  right?: React.ReactNode;
  // Style for brand-colored backgrounds (authentication screens).
  inverse?: boolean;
  ref?: React.Ref<TextInput>;
}

// Labeled text input with hint and error text, so fields never rely on placeholders alone.
const TextField: React.FC<Props> = ({ label, error, hint, right, inverse = false, editable = true, style, ref, ...inputProps }) => (
  <View style={styles.container}>
    <Text style={[styles.label, inverse && styles.inverseText]}>{label}</Text>
    <View
      style={[
        styles.inputRow,
        inverse && styles.inverseInputRow,
        !editable && styles.disabledInputRow,
        !!error && styles.errorInputRow,
      ]}
    >
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error || hint}
        editable={editable}
        placeholderTextColor={inverse ? 'rgba(28, 28, 30, 0.6)' : colors.placeholder}
        style={[styles.input, !editable && styles.disabledText, style]}
        {...inputProps}
      />
      {right}
    </View>
    {error ? (
      <View style={styles.messageRow} accessibilityLiveRegion="polite">
        <Ionicons name="alert-circle" size={16} color={inverse ? colors.onPrimary : colors.danger} />
        <Text style={[styles.error, inverse && styles.inverseError]}>{error}</Text>
      </View>
    ) : hint ? (
      <Text style={[styles.hint, inverse && styles.inverseText]}>{hint}</Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inverseText: {
    color: colors.onPrimary,
  },
  inputRow: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  inverseInputRow: {
    backgroundColor: colors.primaryLight,
    borderColor: '#ccc',
  },
  disabledInputRow: {
    backgroundColor: colors.surface,
  },
  errorInputRow: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  inverseError: {
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default TextField;
