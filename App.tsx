import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import RootNavigation from "./Navigation";

function App() {
  return (
    // Android is edge-to-edge since SDK 54, so StatusBar's backgroundColor is ignored there;
    // the SafeAreaView's background shows behind the status bar instead.
    <SafeAreaView style={[{ flex: 1, marginTop: Platform.OS === 'ios' ? 40 : 0 }, Platform.OS === 'android' && { backgroundColor: '#8C756A' }]}>
      <StatusBar barStyle="light-content" />
      <RootNavigation />
    </SafeAreaView>
  );
}

export default App;