import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import BottomBar from '../../Components/BottomBar';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = ({ navigation }) => {
  const renderListItem = ({ item }) => (
    <Text style={styles.listItem}>{item}</Text>
  );

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={() => console.log('Edit Profile')}>
          <Ionicons name="pencil" size={24} />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/150/foto1.jpg' }} style={styles.profilePhoto} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>
      </View>

      {/* Lazy List */}
      <FlatList
        data={['Item 1', 'Item 2', 'Item 3']} // Example data for LazyList
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Logout Button */}
      <TouchableOpacity onPress={() => console.log('Logout')} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    color: 'blue',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  listItem: {
    padding: 10,
    fontSize: 16,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 15,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfileScreen;
