import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import BottomBar from '../../Components/BottomBar';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../config/firebase';
import { User } from '../../Models/User';
import { getUserById } from '../../Services/UsersService';

const UserProfileScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState<User>(null)

  const user = FIREBASE_AUTH.currentUser
  const isAnonymous = FIREBASE_AUTH.currentUser.isAnonymous ? true : false;

  useEffect(() => {
    if (!isAnonymous) {
      getUserById(user?.uid).then((res: User) => setCurrentUser(res)).catch(console.error);
    }
  }, [user, currentUser])

  const handleLogout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        alert('A sua sessão foi terminada')
      })
  }

  const renderListItem = ({ item }) => (
    <Text style={styles.listItem}>{item}</Text>
  );

  const editProfileButton = () => {
    navigation.navigate('EditProfileScreen')
  }

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color='grey'/>
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
        {user && !user.isAnonymous ? (
          <TouchableOpacity onPress={() => editProfileButton()}>
            <Ionicons name="pencil" size={30} color='grey' />
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>

      <View style={styles.containerInside}>
        {isAnonymous ? (
          <View style={styles.anonymousContainer}>
            <Text style={styles.anonymousText}>Utilizador convidado</Text>
            <Text style={{ fontSize: 20, textAlign: 'center', color: 'grey' }}>Inicie sessão com uma conta para benificiar de todas as funcionalidades</Text>
            {/* Add any additional content for anonymous user */}
          </View>
        ) : (
          <>
            {/* Profile */}
            <View style={styles.profileContainer}>
              {(user && user.photoURL) ? (
                <Image source={{ uri: user.photoURL }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.profilePhoto}>
                  <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user.displayName}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
            </View>

            {/* Lazy List */}
            <View style={styles.lazyListContainer}>
              <Text style={styles.lazyListTitle}>Histórico de transações</Text>
              <FlatList
                data={['Item 1', 'Item 2', 'Item 3']} // Example data for LazyList
                renderItem={renderListItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </>
        )
        }

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Terminar sessão</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Bar */}
      <BottomBar navigation={navigation} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInside: {
    flex: 1,
    padding: 10
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
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
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
  lazyListContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    flex: 1,
  },
  lazyListTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    fontSize: 16,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8C756A',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  anonymousContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anonymousText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default UserProfileScreen;
