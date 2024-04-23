import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import RootNavigation from "./Navigation";

function App() {
  return (
    <SafeAreaView style={[{ flex: 1, marginTop: Platform.OS === 'ios' ? 40 : 0 }]}>
      <StatusBar backgroundColor="#8C756A" barStyle="light-content" />
      <RootNavigation />
    </SafeAreaView>
  );
}

export default App;