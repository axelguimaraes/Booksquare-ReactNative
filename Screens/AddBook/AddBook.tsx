import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { getBookInfoByISBN, populateBookFromJson } from '../../Services/BooksService';

const AddBook = ({ navigation }) => {
  const [isbn, setIsbn] = useState('');

  const handleAddBook = () => {
    // Handle adding book logic here
  };

  const handleISBNSubmit = () => {
    if (!isbn || isbn === '') return;
    getBookInfoByISBN(isbn)
      .then(book => {
        const newBook = populateBookFromJson(book)
        console.log('Book information:', newBook);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.headerTitle}>Adicionar Livro</Text>
          <Text style={styles.headerExplanation}>Pode adicionar livros automaticamente com base num ISBN.</Text>

          <Text style={styles.title}>ISBN</Text>
          <TextInput
            style={styles.input}
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Inserir ISBN"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleISBNSubmit}>
            <Text style={styles.confirmButtonText}>Submeter</Text>
          </TouchableOpacity>
        </View>
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
  separator: {
    backgroundColor: '#8C756A',
    height: 1,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default AddBook;
