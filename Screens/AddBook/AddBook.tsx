import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import CheckboxDropdown from '../../Components/CheckboxDropdown';
import { TransactionType, Genre, Book } from '../../Models/Book';
import PhotoUpload from '../../Components/PhotoUpload';
import Accordion from 'react-native-collapsible/Accordion';
import { getBookInfoByISBN, populateBookFromJson } from '../../Services/BooksService';

const AddBook = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(TransactionType.SALE);
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]);
  const [isbn, setIsbn] = useState('');
  const [activeSections, setActiveSections] = useState([]);

  const genreOptions = Object.values(Genre).map(genre => ({
    label: genre,
    value: genre,
  }));

  const handleSelectedGenres = (value) => {
    setGenres(value)
    console.log("Selected genres:", value)
  }

  const handleAddBook = () => {
    // Handle adding book logic here
  };

  const handleISBNSubmit = () => {
    if (!isbn || isbn === '') return;
    const book: Book = populateBookFromJson(getBookInfoByISBN(isbn))

  }

  const SECTIONS = [
    {
      title: 'ISBN',
      content: (
        <>
          <TextInput
            style={styles.input}
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Inserir ISBN"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleISBNSubmit}>
            <Text style={styles.confirmButtonText}>Submeter</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      title: 'Adicionar Livro',
      content: (
        <>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Inserir título"
          />
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Inserir descrição"
          />
          <Text style={styles.label}>Ano</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="Inserir ano"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Autor</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Inserir autor"
          />
          <Text style={styles.label}>Género</Text>
          <CheckboxDropdown options={genreOptions} onSelect={handleSelectedGenres} initialSelectedOptions={genres} />
          <Text style={styles.label}>Categoria</Text>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: "Venda", value: TransactionType.SALE },
              { label: "Aluguer", value: TransactionType.RENTAL },
              { label: "Troca", value: TransactionType.TRADE },
            ]}
          />
          {category === TransactionType.SALE && (
            <>
              <Text style={styles.label}>Preço</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Inserir preço"
                keyboardType="numeric"
              />
            </>
          )}
          <Text style={styles.label}>Carregar fotos</Text>
          <PhotoUpload />
          <TouchableOpacity style={styles.confirmButton} onPress={handleAddBook}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </>
      ),
    },
  ];

  const renderAccordionContent = (section) => {
    return (
      <View style={styles.accordionContent}>{section.content}</View>
    );
  };

  const renderAccordionHeader = (section) => {
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>{section.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.headerTitle}>Adicionar Livro</Text>
          <Text style={styles.headerExplanation}>Pode adicionar livros  com base em um ISBN automaticamente, ou através do formulário "Adicionar livro" abaixo.</Text>

          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderContent={renderAccordionContent}
            renderHeader={renderAccordionHeader}
            onChange={(activeSections) => setActiveSections(activeSections)}
          />
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
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F0F0F0', // Background color for accordion header
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC', // Border color for accordion header
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Text color for accordion header
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#FFFFFF', // Background color for accordion content
  },
  accordionContentText: {
    fontSize: 14,
    color: '#666666', // Text color for accordion content
  },
});

export default AddBook;
