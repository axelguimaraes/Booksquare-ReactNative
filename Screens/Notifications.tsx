import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../Components/TopBar'
import BottomBar from '../Components/BottomBar';

const Notifications = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopBar />
      {/* Main Content */}
      <View style={styles.content}>
        <Text>Welcome to the Notifications Screen!</Text>
      </View>
      <BottomBar navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Notifications;
