import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../../config/firebase";
import { updateUserById } from "../../Services/UsersService";
import { updateEmail, updateProfile } from "firebase/auth";
import { ImagePickerResult } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import IconBadge from "react-native-icon-badge";
import uploadMedia from "../../Utils/uploadMedia";

interface ProfileFields {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState<string>(null);
  const [email, setEmail] = useState<string>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (text) => setDisplayName(text);
  const handleEmailChange = (text) => setEmail(text);

  const currentUser = FIREBASE_AUTH.currentUser;

  const handlePhotosButton = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedImage = result as ImagePicker.ImagePickerSuccessResult;
      const selectedAssets = selectedImage.assets;
      if (selectedAssets.length > 0) {
        const selectedImages = selectedAssets.map((asset) => asset.uri);
        setProfilePhoto(selectedImages[0]);
      }
    }
  };

  const handlePhotoDeleteButton = () => {
    setProfilePhoto(null);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const infoToUpdate: ProfileFields = {};

      if (email !== null && email !== undefined) {
        await updateEmail(currentUser, email).catch((error) =>
          console.error(error)
        );
      }

      if (displayName !== null && displayName !== undefined) {
        infoToUpdate.displayName = displayName;
      }

      if (profilePhoto !== null && profilePhoto !== undefined) {
        infoToUpdate.photoURL = profilePhoto;
      }

      // Check if there are any fields to update
      if (Object.keys(infoToUpdate).length === 0) {
        alert("Nada a atualizar.");
        navigation.goBack();
        return;
      }

      let downloadURLs;
      if (profilePhoto) {
        const filesToUpload: string[] = [profilePhoto];
        downloadURLs = await uploadMedia(filesToUpload);
        infoToUpdate.photoURL = downloadURLs[0];
      }

      await updateProfile(currentUser, infoToUpdate)
        .then(() => {
          updateUserById(currentUser.uid as string, infoToUpdate);
          alert("Perfil atualizado com sucesso!");
        })
        .catch((error) => console.log(error));

      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erro ao atualizar perfil. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="grey" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        {loading ? (
          <ActivityIndicator color="grey" size={30} />
        ) : (
          <TouchableOpacity onPress={handleSaveProfile}>
            <Ionicons name="save" size={30} color="grey" />
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Profile Form */}
      <View style={styles.formContainer}>
        <View style={styles.profilePicContainer}>
          {profilePhoto ? (
            <IconBadge
              MainElement={
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profilePhoto}
                />
              }
              BadgeElement={
                <TouchableOpacity onPress={handlePhotoDeleteButton}>
                  <Ionicons name="trash" size={20} color="grey" />
                </TouchableOpacity>
              }
              IconBadgeStyle={styles.iconBadge}
            />
          ) : currentUser && currentUser.photoURL ? (
            <Image
              source={{ uri: currentUser.photoURL }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.profilePhoto}>
              <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            </View>
          )}
          <TouchableOpacity
            style={styles.editPicButton}
            onPress={handlePhotosButton}
          >
            <Text style={styles.editPicButtonText}>EDITAR FOTO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Text>Nome:</Text>
          <View style={styles.valueBox}>
            <TextInput
              placeholder={currentUser.displayName}
              value={displayName}
              onChangeText={handleNameChange}
            />
          </View>

          <Text>Email:</Text>
          <View style={styles.valueBox}>
            <TextInput
              placeholder={currentUser.email}
              value={email}
              onChangeText={handleEmailChange}
              editable={false}
            />
          </View>
          <Text style={{ color: "red" }}>
            De momento não é possível alterar email.
          </Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
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
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  profilePicContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPicButton: {
    backgroundColor: "#8C756A",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  editPicButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  userInfoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
  },
  valueBox: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },
});

export default EditProfileScreen;
