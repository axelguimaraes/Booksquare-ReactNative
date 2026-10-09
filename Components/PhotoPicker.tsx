import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from './ui/theme';

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  error?: string;
}

const pickerOptions: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8 };

// Thumbnails of the chosen photos with remove buttons, plus a tile to add more from the camera or gallery.
const PhotoPicker: React.FC<Props> = ({ photos, onChange, max = 6, error }) => {
  const addUris = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      onChange([...photos, ...result.assets.map((asset) => asset.uri)].slice(0, max));
    }
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Sem acesso à câmara', 'Permita o acesso à câmara nas definições do dispositivo para tirar fotos.');
      return;
    }
    addUris(await ImagePicker.launchCameraAsync(pickerOptions));
  };

  // The system photo picker needs no permission on current iOS and Android versions.
  const chooseFromGallery = async () => {
    addUris(await ImagePicker.launchImageLibraryAsync({
      ...pickerOptions,
      allowsMultipleSelection: true,
      selectionLimit: max - photos.length,
    }));
  };

  const addPhotos = () => {
    Alert.alert('Adicionar fotos', 'Tire uma foto ao livro ou escolha fotos da galeria.', [
      { text: 'Tirar foto', onPress: takePhoto },
      { text: 'Escolher da galeria', onPress: chooseFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const removePhoto = (index: number) => onChange(photos.filter((_, i) => i !== index));

  return (
    <View>
      <View style={styles.grid}>
        {photos.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.tile}>
            <Image source={{ uri }} style={styles.image} accessibilityLabel={`Foto ${index + 1}`} />
            <Pressable
              onPress={() => removePhoto(index)}
              style={styles.removeButton}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Remover foto ${index + 1}`}
            >
              <Ionicons name="close" size={16} color={colors.onPrimary} />
            </Pressable>
          </View>
        ))}
        {photos.length < max && (
          <Pressable
            onPress={addPhotos}
            style={({ pressed }) => [styles.tile, styles.addTile, !!error && styles.addTileError, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Adicionar fotos"
            accessibilityHint={error}
          >
            <Ionicons name="camera-outline" size={28} color={colors.primary} />
            <Text style={styles.addText}>Adicionar</Text>
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
      ) : (
        <Text style={styles.hint}>{photos.length}/{max} fotos</Text>
      )}
    </View>
  );
};

const TILE = 96;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: radius.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTileError: {
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.6,
  },
  addText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

export default PhotoPicker;
