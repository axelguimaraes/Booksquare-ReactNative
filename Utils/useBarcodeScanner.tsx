import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { CameraType } from 'expo-camera/build/Camera.types';

interface BarcodeScannerProps {
  onBarCodeScanned: (data: string) => void;
  onClose: () => void
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarCodeScanned, onClose }) => {
  const [facing, setFacing] = useState(CameraType.back);
  const [, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  const handleBarCodeScannedInternal = ({ type, data }) => {
    onBarCodeScanned(data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.cameraContainer}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={handleBarCodeScannedInternal}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center', // Center content vertically
    //alignItems: 'center', // Center content horizontally
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20, // Adjust as needed
    left: '40%', // Center horizontally
    backgroundColor: '#8C756A',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});

export default BarcodeScanner;
