import "react-native-gesture-handler";
import React from "react";
import AppNavigation from "./Navigation/NavigationStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./Auth/AuthContext";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaView>
  );
}

export default App;