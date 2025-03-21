import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';

const Search = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      {/* Main Content */}
      <View style={styles.content}>
        <Text>Welcome to the Search Screen!</Text>
      </View>
      <BottomBar navigation={navigation} />
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

export default Search;
