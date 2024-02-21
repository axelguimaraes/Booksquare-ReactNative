import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RootNavigation from "./Navigation";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} >
        <RootNavigation />
    </SafeAreaView>
  );
}

export default App;