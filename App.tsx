import "react-native-gesture-handler";
import React from "react";
import AppNavigation from "./Navigation/NavigationStack";
import { SafeAreaView } from "react-native-safe-area-context";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <AppNavigation />
    </SafeAreaView>
  );
}

export default App;