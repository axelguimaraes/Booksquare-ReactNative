import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../config/firebase';
import { updateUserById } from '../../Services/UsersService';
import { updateProfile } from 'firebase/auth';

interface ProfileFields {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState<string>(null);
  const [email, setEmail] = useState<string>(null)
  const [profilePhoto, setProfilePhoto] = useState<string>(null)

  const currentUser = FIREBASE_AUTH.currentUser

  const handleSaveProfile = async () => {
    try {
      const infoToUpdate: ProfileFields = {}

      if (displayName !== null && displayName !== undefined) {
        infoToUpdate.displayName = displayName;
      }

      if (email !== null && email !== undefined) {
        infoToUpdate.email = email;
      }

      if (profilePhoto !== null && profilePhoto !== undefined) {
        infoToUpdate.photoURL = profilePhoto;
      }

      // Check if there are any fields to update
      if (Object.keys(infoToUpdate).length === 0) {
        alert('Nada a atualizar.');
        navigation.goBack();
        return;
      }

      await updateProfile(currentUser, infoToUpdate)
        .then(() => {
          updateUserById(currentUser.uid as string, infoToUpdate)
          alert("Perfil atualizado com sucesso!")
        })
        .catch((error) => console.log(error))

      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color='grey' />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Ionicons name='save' size={30} color='grey' />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Form */}
      <View style={styles.formContainer}>
        <View style={styles.profilePicContainer}>
          {(currentUser && currentUser.photoURL) ? (
            <Image source={{ uri: currentUser.photoURL }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.profilePhoto}>
              <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            </View>
          )}
          <TouchableOpacity style={styles.editPicButton}>
            <Text style={styles.editPicButtonText}>EDITAR FOTO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Text>Nome:</Text>
          <View style={styles.valueBox}>
            <TextInput placeholder={currentUser.displayName}></TextInput>
          </View>

          <Text>Email:</Text>
          <View style={styles.valueBox}>
            <TextInput placeholder={currentUser.email}></TextInput>
          </View>
        </View>

      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  profilePicContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPicButton: {
    backgroundColor: '#8C756A',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  editPicButtonText: {
    fontWeight: 'bold',
    color: 'white'
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 20
  },
  valueBox: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
    width: '100%',
    marginBottom: 10,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
});

export default EditProfileScreen;
