import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from "react-native-safe-area-context";
import RootNavigation from "./Navigation";
import { colors } from "./Components/ui/theme";

// The brand color fills the status bar area on both platforms (Android is edge-to-edge, so the
// app draws behind it). Screens handle the bottom inset themselves, since what sits there differs
// (bottom bar, footer buttons, chat input).
function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="light" />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
        <RootNavigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});

export default App;
