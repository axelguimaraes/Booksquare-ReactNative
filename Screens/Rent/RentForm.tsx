import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { useNavigation } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import { rentBook } from '../../Services/BooksService';
import { FIREBASE_AUTH } from '../../config/firebase';

const RentForm = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { book } = route.params
    const navigation = useNavigation()
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDiscardBook = () => {
        navigation.goBack()
    };

    const handleConfirmButton = () => {
        rentBook({ bookId: book.id, userId: FIREBASE_AUTH.currentUser.uid, date: selectedDate })
            .then(() => {
                alert('Livro alugado com sucesso!');
                navigation.goBack()
            })
    };


    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    return (
        <View style={styles.container}>
            <TopBar navigation={navigation} />
            <ScrollView contentContainerStyle={styles.bookDetailsContainer}>
                <View style={styles.bookDetails}>
                    <Text style={styles.headerTitle}>Alugar Livro</Text>

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

                    <Text style={styles.title}>Alugar até:</Text>
                    <TouchableOpacity onPress={toggleDatePicker}>
                        <View style={styles.valueBox}>
                            <Text style={styles.valueBoxContent}>{selectedDate ? selectedDate.toLocaleDateString() : 'Selecione uma data'}</Text>
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DatePicker
                            value={selectedDate}
                            onChange={(event, date) => {
                                setSelectedDate(date);
                                toggleDatePicker(); // Close date picker after selecting a date
                            }}
                            locale="pt-BR" // Set the locale to Portuguese (Brazil)
                        />
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
        padding: 20
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
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
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
});

export default RentForm;
