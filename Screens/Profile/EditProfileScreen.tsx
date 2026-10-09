import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCurrentUser, updateCurrentUserProfile } from "../../Services/AuthService";
import { updateUserById } from "../../Services/UsersService";
import { uploadMedia } from "../../Services/StorageService";
import { User } from "../../Models/User";
import Avatar from "../../Components/ui/Avatar";
import Button from "../../Components/ui/Button";
import ScreenHeader from "../../Components/ui/ScreenHeader";
import TextField from "../../Components/ui/TextField";
import { Footer, KeyboardScreen } from "../../Components/ui/Layout";
import { colors, spacing, typography } from "../../Components/ui/theme";

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const currentUser = getCurrentUser();
  const [displayName, setDisplayName] = useState(currentUser.displayName ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  // Newly picked photo, not uploaded yet.
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmedName = displayName.trim();
  const hasChanges = trimmedName !== (currentUser.displayName ?? "") || !!newPhoto;

  const handlePhotosButton = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewPhoto(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!trimmedName) {
      setNameError("O nome de utilizador não pode ficar vazio.");
      return;
    }

    setSaving(true);
    try {
      const profile: { displayName?: string, photoURL?: string } = {};
      if (trimmedName !== currentUser.displayName) {
        profile.displayName = trimmedName;
      }
      if (newPhoto) {
        [profile.photoURL] = await uploadMedia([newPhoto]);
      }

      await updateCurrentUserProfile(profile);

      // The user document stores the photo as profilePhoto, which other screens read.
      const userData: Partial<User> = {};
      if (profile.displayName) userData.displayName = profile.displayName;
      if (profile.photoURL) userData.profilePhoto = profile.photoURL;
      await updateUserById(currentUser.uid, userData);

      Alert.alert("Perfil atualizado", "As alterações foram guardadas.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Não foi possível guardar", "Ocorreu um erro ao atualizar o perfil. Tente novamente mais tarde.");
      setSaving(false);
    }
  };

  return (
    <KeyboardScreen>
      <ScreenHeader title="Editar perfil" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.photoSection}>
          <Avatar uri={newPhoto ?? currentUser.photoURL} size={120} />
          <Button variant="secondary" title="Alterar foto" icon="camera-outline" onPress={handlePhotosButton} style={styles.photoButton} />
          {newPhoto && (
            <Pressable onPress={() => setNewPhoto(null)} style={styles.undoButton} accessibilityRole="button">
              <Text style={styles.undoText}>Manter a foto atual</Text>
            </Pressable>
          )}
        </View>

        <TextField
          label="Nome de utilizador"
          value={displayName}
          onChangeText={(text) => {
            setDisplayName(text);
            setNameError(null);
          }}
          autoCapitalize="words"
          returnKeyType="done"
          error={nameError}
        />
        <TextField
          label="Email"
          value={currentUser.email ?? ""}
          editable={false}
          hint="De momento não é possível alterar o email."
        />
      </ScrollView>
      <Footer>
        <Button title="Guardar alterações" onPress={handleSaveProfile} loading={saving} disabled={!hasChanges} style={styles.saveButton} />
      </Footer>
    </KeyboardScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  photoButton: {
    marginTop: spacing.md,
    alignSelf: "center",
  },
  undoButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  undoText: {
    ...typography.body,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  saveButton: {
    flex: 1,
  },
});

export default EditProfileScreen;
