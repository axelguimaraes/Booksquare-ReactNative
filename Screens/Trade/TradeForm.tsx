import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, TextInput, Image as RNImage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker';

const TradeForm = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const { book } = route.params
    const navigation = useNavigation()
    const [bookToTradeISBN, setBookToTradeISBN] = useState(null)
    const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to make this work!');
            }
        })();
    }, []);

    const handleDiscardBook = () => {
        navigation.goBack()
    };

    const handleConfirmButton = () => {
        setLoading(true);
        if (!checkISBN()) {
            alert('Insira um ISBN válido');
            setLoading(false); // Reset loading state
            return;
        }
        setLoading(false);
    };

    const handleBarcodeButton = () => {
        // setIsBarcodeScannerVisible(true);
        alert('Função não implementada')
    };

    const handlePhotosButton = async () => {
        let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const successResult = result as ImagePicker.ImagePickerSuccessResult;
            const selectedAssets = successResult.assets;
            if (selectedAssets.length > 0) {
                const selectedImages = selectedAssets.map(asset => asset.uri);
                setSelectedImages(selectedImages); // Store selected image URIs
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    const checkISBN = (): boolean => {
        if (!bookToTradeISBN || bookToTradeISBN === '') {
            return false
        }

        const isbnRegex = /^(?:\d{13}|\d{9}[\dXx])$/;
        if (!isbnRegex.test(bookToTradeISBN)) {
            return false;
        }
        return true
    }


    return (
        <View style={styles.container}>
            <TopBar navigation={navigation} />
            <ScrollView contentContainerStyle={styles.bookDetailsContainer}>
                <View style={styles.bookDetails}>
                    <Text style={styles.headerTitle}>Trocar Livro</Text>

                    <Text style={styles.title}>ISBN</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueBoxContent}>{book.isbn}</Text>
                    </View>

                    <Text style={styles.title}>Título</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueBoxContent}>{book.title}</Text>
                    </View>

                    <Text style={styles.title}>Ano</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueBoxContent}>{book.year}</Text>
                    </View>

                    <Text style={styles.title}>Autor(es)</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueBoxContent}>{book.author}</Text>
                    </View>

                    <Text style={styles.title}>Categorias</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueBoxContent}>{book.genre.join(', ')}</Text>
                    </View>

                    <Text style={styles.title}>Trocar por:</Text>
                    <View style={styles.tradeBy}>
                        <TextInput
                            style={styles.input}
                            value={bookToTradeISBN}
                            onChangeText={setBookToTradeISBN}
                            placeholder="Inserir ISBN"
                            keyboardType='number-pad'
                        />
                        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={handleBarcodeButton} >
                            <Ionicons name="barcode-outline" size={35} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Fotos do livro para trocar:</Text>
                    {selectedImages.length === 0 ? (
                        <TouchableOpacity style={styles.photosButton} onPress={handlePhotosButton}>
                            <Ionicons name='camera-outline' size={20} color="white"></Ionicons>
                            <Text style={styles.photosButtonText}>Carregar fotos</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.selectedImagesContainer}>
                            {selectedImages.map((imageUri, index) => (
                                <View key={index} style={styles.selectedImageContainer}>
                                    <RNImage source={{ uri: imageUri }} style={styles.selectedImage} />
                                    <TouchableOpacity onPress={() => handleRemoveImage(index)} style={styles.deleteButton}>
                                        <Ionicons name="trash-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}


                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.discardButton} onPress={handleDiscardBook}>
                            <Ionicons name="trash-outline" size={19} color="black" />
                            <Text style={styles.discardButtonText}>Descartar Livro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBookButton} onPress={handleConfirmButton}>
                            {loading ? <ActivityIndicator size="small" color="white" />
                                :
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <BottomBar navigation={navigation} />
            {/* {isBarcodeScannerVisible && (
                <BarcodeScanner/>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    headerExplanation: {
        fontSize: 14,
        color: '#666',
        paddingBottom: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    valueBox: {
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "flex-start",
        justifyContent: "center",
        marginBottom: 10,
        borderColor: '#ccc',
    },
    valueBoxContent: {
        marginLeft: 10,
        lineHeight: 30,
    },
    priceInput: {
        marginTop: 10
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        flex: 1,
        height: 35,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    confirmButton: {
        backgroundColor: '#8C756A',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookDetailsContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    bookDetails: {
        padding: 20
    },
    transactionTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    discardButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    confirmBookButton: {
        backgroundColor: '#8C756A',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discardButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    tradeBy: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 10
    },
    photosButton: {
        backgroundColor: '#8C756A',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    photosButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 15
    },
    selectedImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    selectedImageContainer: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
});

export default TradeForm;
