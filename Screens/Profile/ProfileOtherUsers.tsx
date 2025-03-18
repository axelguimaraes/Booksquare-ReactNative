import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BottomBar from '../../Components/BottomBar';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../Models/User';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigationParamsList } from '../../Navigation/UserStack';
import { getUserByDisplayName, getUserById } from '../../Services/UsersService';
import { FIREBASE_AUTH } from '../../config/firebase';

type ProfileOtherUsersNavigationProp = StackNavigationProp<StackNavigationParamsList, 'ProfileOtherUsers'>;
type ProfileOtherUsersRouteProp = RouteProp<StackNavigationParamsList, 'ProfileOtherUsers'>;

type Props = {
  navigation: ProfileOtherUsersNavigationProp;
  route: ProfileOtherUsersRouteProp;
};

const ProfileOtherUsers: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(userId)
      .then((userData) => {
        setUser(userData)
        setLoading(false);
      });
  }, [userId]);

  const handleMessageButton = async () => {
    if (loading) return
    let currentUser: User;
    await getUserById(FIREBASE_AUTH.currentUser.uid).then((user) => currentUser = user)

    navigation.navigate('ChatScreen', { currentUser: currentUser.userId, otherUser: user.userId, book: null });
  }

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
        <View></View>
      </View>

      <View style={styles.containerInside}>
        {loading ? (
          <ActivityIndicator size="large" color="#8C756A" />
        ) : (
          <>
            {/* Profile */}
            {
              user && ( // Conditionally render profile when user is not null
                <View style={styles.profileContainer}>
                  {user.profilePhoto ? (
                    <Image source={{ uri: user.profilePhoto }} style={styles.profilePhoto} />
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
              )
            }

            {/* Lazy List */}
            <View style={styles.lazyListContainer}>
              <Text style={styles.lazyListTitle}>Histórico de transações</Text>
              <FlatList
                data={['Item 1', 'Item 2', 'Item 3']} // Example data for LazyList
                renderItem={renderListItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.messageButton} onPress={handleMessageButton}>
              <Text style={styles.messageText}>Enviar mensagem</Text>
              <View style={{ paddingLeft: 30 }}>
                <Ionicons name='chatbox-ellipses-outline' color='white' size={25} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Bottom Bar */}
      <BottomBar navigation={navigation} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10
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
  messageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8C756A',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  messageText: {
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

export default ProfileOtherUsers;
