import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import Tabs from '../../Components/MainTabs';
import { colors } from '../../Components/ui/theme';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Tabs />
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
