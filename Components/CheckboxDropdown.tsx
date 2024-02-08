import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckboxDropdown = ({ options, onSelect, initialSelectedOptions }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (initialSelectedOptions && initialSelectedOptions.length > 0) {
            setSelectedOptions(initialSelectedOptions);
        }
    }, [initialSelectedOptions]);    

    const toggleOption = (option) => {
        const index = selectedOptions.indexOf(option);
        if (index === -1) {
            setSelectedOptions([...selectedOptions, option]);
        } else {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        }
    };

    const handleSelect = () => {
        onSelect(selectedOptions);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.genreField} onPress={() => setModalVisible(true)}>
                <Text style={styles.genreText}>
                    {selectedOptions.length === 0
                        ? 'Selecionar opções...'
                        : selectedOptions.map(option => option.label).join(', ')}
                </Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.optionContainer}
                                onPress={() => toggleOption(option)}
                            >
                                <Text>{option.label}</Text>
                                <View style={styles.checkbox}>
                                    {/* Custom icon for checked state */}
                                    {selectedOptions.includes(option) && (
                                        <Ionicons name="checkmark-sharp" size={20} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.confirmButton} onPress={handleSelect}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    genreField: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: 'lightgray'
    },
    genreText: {
        color: 'gray'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%'
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: 'black',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButton: {
        backgroundColor: '#8C756A',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CheckboxDropdown;
