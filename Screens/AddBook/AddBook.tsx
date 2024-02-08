import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { TransactionType } from '../../Models/Book';
import { CheckBox } from 'react-native-btr';

const AddBook = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(TransactionType.SALE);
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]);

  const handleAddBook = () => {
    // Handle adding book logic here
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
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
            value={title}
            onChangeText={setAuthor}
            placeholder="Inserir autor"
          />
          <Text style={styles.label}>Género</Text>
          <View>
            
          </View>
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
          {/* Implement photo upload component here */}
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleAddBook}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
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
});

export default AddBook;