import React, { useEffect, useRef } from 'react';
import { Linking, Modal, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './ui/Button';
import { colors, radius, spacing, typography } from './ui/theme';

interface Props {
  visible: boolean;
  onScanned: (isbn: string) => void;
  onClose: () => void;
}

// Book barcodes are EAN-13 codes starting with 978 or 979 (the ISBN-13); other EAN-13 codes,
// such as price stickers, are ignored.
const isIsbnBarcode = (data: string) => /^97[89]\d{10}$/.test(data);

const BarcodeScanner: React.FC<Props> = ({ visible, onScanned, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  // The camera reports the same code many times per second; only the first one counts.
  const scanned = useRef(false);

  useEffect(() => {
    if (visible) {
      scanned.current = false;
      if (permission && !permission.granted && permission.canAskAgain) {
        requestPermission();
      }
    }
  }, [visible, permission?.granted]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned.current || !isIsbnBarcode(data)) return;
    scanned.current = true;
    onScanned(data);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.container}>
        {permission?.granted ? (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <View style={styles.overlay} pointerEvents="none">
              <View style={styles.frame} />
              <Text style={styles.instructions}>Aponte a câmara para o código de barras do livro</Text>
            </View>
          </>
        ) : (
          <View style={styles.overlay}>
            <Text style={styles.instructions}>
              {permission && !permission.canAskAgain
                ? 'O acesso à câmara foi recusado. Permita-o nas definições para ler códigos de barras.'
                : 'É necessário acesso à câmara para ler o código de barras.'}
            </Text>
            {permission && (
              <Button
                variant="onPrimary"
                title={permission.canAskAgain ? 'Permitir acesso à câmara' : 'Abrir definições'}
                onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
                style={styles.permissionButton}
              />
            )}
          </View>
        )}
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Button variant="outlineOnPrimary" title="Cancelar" onPress={onClose} />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  frame: {
    width: '80%',
    aspectRatio: 1.8,
    borderWidth: 3,
    borderColor: colors.onPrimary,
    borderRadius: radius.md,
  },
  instructions: {
    ...typography.body,
    color: colors.onPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  permissionButton: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default BarcodeScanner;
