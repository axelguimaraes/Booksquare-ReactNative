import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppNavigation from "./Navigation/NavigationStack";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} >
        <AppNavigation />
    </SafeAreaView>
  );
}

export default App;